ba#!/usr/bin/env sh
git add .
git commit -m "One more"
git push

npm run build
git add dist -f
git commit -m "adding dist"
git subtree push --prefix dist origin gh-pages
