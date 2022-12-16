<script setup>
import axios from "axios";
import uniqby from "lodash.uniqby";
import { ref } from "vue";
import { expandDate, getYearData } from "./utils";

const groupBy = (list, string) => {
  const groups = {};

  list.forEach((item) => {
    const key = item[string];

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push({ ...item });
  });

  return groups;
};

const openingsAll = ref([]);
const uniqAll = ref([]);

const groupByYear = ref([]);
const dataByYaer = ref([]);

axios
  .get(
    "https://hammerhead-app-k9ypy.ondigitalocean.app/figma-analytics-server/admin"
  )
  .then(function (response) {
    openingsAll.value = expandDate(response.data);
    uniqAll.value = uniqby(openingsAll.value, "id");

    groupByYear.value = groupBy(openingsAll.value, (item) => item.year);
    dataByYaer.value = getYearData(groupByYear.value);

    console.log(dataByYaer.value);
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
      v-for="value in dataByYaer"
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
      v-for="value in dataByYaer"
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
  font-size: 20px;
  font-weight: bold;
}
</style>
