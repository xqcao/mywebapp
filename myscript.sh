
rm -rf .git
git init
git add .
git commit -m "init"
heroku create
git push heroku master
