<script setup>
import axios from "axios";
import uniqby from "lodash.uniqby";
import groupBy from "lodash.groupBy";
import { ref } from "vue";
import { expandDate, getData } from "./utils";

const openingsAll = ref([]);
const uniqAll = ref([]);

const groupByYear = ref({});
const dataByYear = ref([]);

const groupByMonth = ref({});
const dataByMonth = ref({});

const groupByDay = ref({});
const dataByDay = ref({});

axios
  .get(
    "https://hammerhead-app-k9ypy.ondigitalocean.app/figma-analytics-server/admin"
  )
  .then(function (response) {
    openingsAll.value = expandDate(response.data);
    uniqAll.value = uniqby(openingsAll.value, "id");

    groupByYear.value = groupBy(openingsAll.value, (item) => item.year);
    dataByYear.value = getData(groupByYear.value);

    for (const [key, value] of Object.entries(groupByYear.value)) {
      groupByMonth.value[key] = groupBy(value, (item) => item.month);
    }
    for (const [key, value] of Object.entries(groupByMonth.value)) {
      dataByMonth.value[key] = getData(value);
    }

    for (const [year, yearValue] of Object.entries(groupByMonth.value)) {
      for (const [month, monthValue] of Object.entries(yearValue)) {
        groupByDay.value[year] = {};
        groupByDay.value[year][month] = groupBy(monthValue, (item) => item.day);
      }
    }

    for (const [year, yearValue] of Object.entries(groupByDay.value)) {
      for (const [month, monthValue] of Object.entries(yearValue)) {
        dataByDay.value[year] = {};
        dataByDay.value[year][month] = getData(monthValue);
      }
    }
  })
  .catch(function (error) {
    console.log(error);
  });
</script>

<template>
  <h1>Аналитика</h1>

  <hr />
  <br />

  <h2>Всего</h2>
  <p>Открытий плагина за все время: {{ openingsAll.length }}</p>
  <p>Уникальных пользователей за все время: {{ uniqAll.length }}</p>

  <br />
  <hr />
  <br />

  <h2>По годам</h2>
  <h3>Открытий</h3>

  <div class="table">
    <p
      v-for="value in dataByYear"
      :key="value.name"
      class="table__item"
      :style="{ height: `${value.openingsHeight}%` }"
    >
      <span class="table__value">{{ value.openings }}</span>
      <span class="table__name">{{ value.name }}</span>
    </p>
  </div>

  <h3>Уникальных пользователей</h3>

  <div class="table">
    <p
      v-for="value in dataByYear"
      :key="value.name"
      class="table__item"
      :style="{ height: `${value.uniqHeight}%` }"
    >
      <span class="table__value">{{ value.uniq }}</span>
      <span class="table__name">{{ value.name }}</span>
    </p>
  </div>

  <br />
  <hr />
  <br />

  <h2>По месяцам</h2>

  <div v-for="(month, year) in dataByMonth" :key="year">
    <h3>Открытий за {{ year }} год</h3>
    <div class="table">
      <p
        v-for="value in month"
        :key="value.name"
        class="table__item"
        :style="{ height: `${value.openingsHeight}%` }"
      >
        <span class="table__value">{{ value.openings }}</span>
        <span class="table__name">{{ value.name }}</span>
      </p>
    </div>

    <h3>Уникальных пользователей за {{ year }} год</h3>

    <div class="table">
      <p
        v-for="value in month"
        :key="value.name"
        class="table__item"
        :style="{ height: `${value.uniqHeight}%` }"
      >
        <span class="table__value">{{ value.uniq }}</span>
        <span class="table__name">{{ value.name }}</span>
      </p>
    </div>
  </div>

  <h2>По дням</h2>

  <div v-for="(month, year) in dataByDay" :key="year">
    <p>{{ year }} год</p>
    <div v-for="(day, month) in month" :key="month">
      <h3>Открытий за {{ month }}</h3>
      <div class="table">
        <p
          v-for="value in day"
          :key="value.name"
          class="table__item"
          :style="{ height: `${value.openingsHeight}%` }"
        >
          <span class="table__value">{{ value.openings }}</span>
          <span class="table__name">{{ value.name }}</span>
        </p>
      </div>

      <h3>Уникальных пользователей за {{ month }}</h3>

      <div class="table">
        <p
          v-for="value in day"
          :key="value.name"
          class="table__item"
          :style="{ height: `${value.uniqHeight}%` }"
        >
          <span class="table__value">{{ value.uniq }}</span>
          <span class="table__name">{{ value.name }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 30vw;
  padding-bottom: 30px;
}

.table__item {
  position: relative;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  background-color: #fa8072;
}

.table__name {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
}

.table__value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>
