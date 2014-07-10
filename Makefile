projekt=onair2
version=2
prefix=/usr/local

appscrpts=src/app/onair2.js

views=src/app/views/admin.jade \
      src/app/views/status.jade

controls=src/app/controls/admin.js

libfiles=src/app/lib/asteriskrequest.js \
         src/app/lib/fortunerequest.js \
         src/app/lib/mvvinfo.js

managers=src/app/manager/statemanager.js \
         src/app/manager/configmanager.js

templates=src/templates/status.json \
          src/templates/config.json

clean-all: clean-npm clean-dist clean-tar

clean-npm:
	rm ./$(projekt)-$(version)_npm.tgz

clean-dist:
	rm -Rf $(projekt)-$(version)

clean-tar:
	rm ./$(projekt)-$(version).tar.gz $(projekt)-$(version)/


dist:
	mkdir -p                     $(projekt)-$(version)/
	cp src/index.js              $(projekt)-$(version)/
	cp -r src/public             $(projekt)-$(version)/
	cp -r Makefile               $(projekt)-$(version)/

	mkdir -p $(projekt)-$(version)/app
	printf "$(appscrpts)" | xargs cp -t $(projekt)-$(version)/app/

	mkdir -p $(projekt)-$(version)/app/controls
	printf "$(controls)" | xargs cp -t $(projekt)-$(version)/app/controls/

	mkdir -p $(projekt)-$(version)/app/lib
	printf "$(libfiles)" | xargs cp -t $(projekt)-$(version)/app/lib/

	mkdir -p $(projekt)-$(version)/app/manager
	printf "$(managers)" | xargs cp -t $(projekt)-$(version)/app/manager/

	mkdir -p $(projekt)-$(version)/app/views
	printf "$(views)" | xargs cp -t $(projekt)-$(version)/app/views/

	mkdir -p $(projekt)-$(version)/templates
	printf "$(templates)" | xargs cp -t $(projekt)-$(version)/templates/

	mkdir -p                     $(projekt)-$(version)/systemd
	cp -r systemd/onair2.service $(projekt)-$(version)/systemd/

dist-tar: dist
	tar -czf ./$(projekt)-$(version).tar.gz ./$(projekt)-$(version)/

dist-npm:
	tar -czf ./$(projekt)-$(version)_npm.tgz ./$(projekt)-$(version)/ ./package.json

uninstall:
	systemctl stop onair2.service
	systemctl disable onair2.service
	rm /usr/lib/systemd/system/onair2.service
	rm -Rf $(prefix)/$(projekt)/index.js
	rm -Rf $(prefix)/$(projekt)/app
	rm -Rf $(prefix)/$(projekt)/node_modules


install:
	mkdir -p $(prefix)/$(projekt)/
	cp -r index.js        $(prefix)/$(projekt)/
	cp -r app             $(prefix)/$(projekt)/
	cp -r public          $(prefix)/$(projekt)/
	# npm installs
	npm install express@3.2.x
	npm install body-parser@1.3.x
	npm install cookie-parser@1.1.x
	npm install cookie-session@1.0.2
	npm install jade@0.30.x
	npm install exec-sync@0.1.x
	npm install htmlparser@1.7.x
	npm install body-parser@1.4.x
	npm update
	mv node_modules $(prefix)/$(projekt)/node_modules

	mkdir -p $(prefix)/$(projekt)/var/
	[ -f $(prefix)/$(projekt)/var/status.json ] || cp templates/status.json $(prefix)/$(projekt)/var/status.json
	[ -f $(prefix)/$(projekt)/var/config.json ] || cp templates/config.json $(prefix)/$(projekt)/var/config.json
	[ -f /usr/lib/systemd/system/onair2.service ] || cp systemd/onair2.service  /usr/lib/systemd/system/
	systemctl daemon-reload
	systemctl start onair2.service
	systemctl enable onair2.service

update: uninstall install

# create a develop environment
create-dev-env:
	# npm installs
	npm install express@3.2.x
	npm install body-parser@1.3.x
	npm install cookie-parser@1.1.x
	npm install cookie-session@1.0.2
	npm install jade@0.30.x
	npm install exec-sync@0.1.x
	npm install htmlparser@1.7.x
	npm install body-parser@1.4.x
	npm update
	mv node_modules src/node_modules
	mkdir -p src/var/
	[ -f src/var/status.json ] || cp src/templates/status.json src/var/status.json

