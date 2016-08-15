export PATH=$PATH:/usr/local/bin
export NODE_PATH=/usr/local/share/node
export USER=user
export HOME=/home/user
source $HOME/.nvm/nvm.sh
cd /var/www/sumobase
cp /var/www/config/* /var/www/sumobase/src/config/
nvm use 6.2.1
gulp compile &
pm2 stop /var/www/sumobase/dist/app.js
pm2 start /var/www/sumobase/dist/app.js
