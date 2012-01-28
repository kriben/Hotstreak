#!/usr/bin/env sh

echo "Pushing hotstreak into production..."

echo "Running tests just to make sure..."
python hotstreaksite/manage.py test
if [ $? -eq 1 ] ; then
    echo "Pushing to prod failed: tests failed!"
    exit 1
fi

echo "Setting maintenance mode.."
heroku maintenance:on

echo "Pushing static assets to Amazon S3..."
python hotstreaksite/manage.py collectstatic

echo "Pushing code to heroku"
git push heroku

echo "Leaving maintenance mode..."
heroku maintenance:off
