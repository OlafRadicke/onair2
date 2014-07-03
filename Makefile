version=1
prefix=/usr/local

appscrpts=src/app/onair2.js

views=src/app/views/admin.jade \
      src/app/views/status.jade

controls=src/app/controls/admin.js

libfiles=src/app/lib/asteriskrequest.js \
         src/app/lib/mvvinfo.js

managers=src/app/manager/statemanager.js

templates=src/templates/status.json

clean-all: clean-npm clean-dist clean-tar

clean-npm:
	rm ./onari2-$(version)_npm.tgz

clean-dist:
	rm -Rf onari2-$(version)

clean-tar:
	rm ./onari2-$(version).tar.gz onari2-$(version)/


dist:
	mkdir -p                     onari2-$(version)/
	cp src/index.js              onari2-$(version)/
	cp -r src/js                 onari2-$(version)/
	cp -r src/public             onari2-$(version)/
	cp -r Makefile               onari2-$(version)/

	mkdir -p onari2-$(version)/app
	printf "$(appscrpts)" | xargs cp -t onari2-$(version)/app/

	mkdir -p onari2-$(version)/app/controls
	printf "$(controls)" | xargs cp -t onari2-$(version)/app/controls/

	mkdir -p onari2-$(version)/app/lib
	printf "$(libfiles)" | xargs cp -t onari2-$(version)/app/lib/

	mkdir -p onari2-$(version)/app/manager
	printf "$(managers)" | xargs cp -t onari2-$(version)/app/manager/

	mkdir -p onari2-$(version)/app/views
	printf "$(views)" | xargs cp -t onari2-$(version)/app/views/

	mkdir -p onari2-$(version)/templates
	printf "$(templates)" | xargs cp -t onari2-$(version)/templates/

	mkdir -p                     onari2-$(version)/systemd
	cp -r systemd/onair2.service onari2-$(version)/systemd/

dist-tar: dist
	tar -czf ./onari2-$(version).tar.gz ./onari2-$(version)/

dist-npm:
	tar -czf ./onari2-$(version)_npm.tgz ./onari2-$(version)/ ./package.json

uninstall:
	systemctl stop onair2.service
	systemctl disable onair2.service
	rm /usr/lib/systemd/system/onair2.service
	rm -Rf $(prefix)/onari2/index.js
	rm -Rf $(prefix)/onari2/app
	rm -Rf $(prefix)/onari2/node_modules
	rm -Rf $(prefix)/onari2/js


install:
	mkdir -p $(prefix)/onari2/
	cp -r index.js        $(prefix)/onari2/
	cp -r app             $(prefix)/onari2/
	cp -r js              $(prefix)/onari2/
	cp -r public          $(prefix)/onari2/
	# npm installs
	cd $(prefix)/onari2/ && npm install express@3.2.x
	cd $(prefix)/onari2/ && npm install body-parser@1.3.x
	cd $(prefix)/onari2/ && npm install cookie-parser@1.1.x
	cd $(prefix)/onari2/ && npm install cookie-session@1.0.2
	cd $(prefix)/onari2/ && npm install jade@0.30.x
	cd $(prefix)/onari2/ && npm install exec-sync@0.1.x
	cd $(prefix)/onari2/ && npm install htmlparser@1.7.x
	cd $(prefix)/onari2/ && npm install body-parser@1.4.x

	mkdir -p $(prefix)/onari2/var/
	[ -f $(prefix)/onari2/var/status.json ] || cp templates/status.json $(prefix)/onari2/var/status.json
	[ -f /usr/lib/systemd/system/onair2.service ] || cp systemd/onair2.service  /usr/lib/systemd/system/
	systemctl daemon-reload
	systemctl start onair2.service
	systemctl enable onair2.service

update: uninstall install

# create a develop environment
create-dev-env:
	# npm installs
	cd src/ && npm install express@3.2.x
	cd src/ && npm install body-parser@1.3.x
	cd src/ && npm install cookie-parser@1.1.x
	cd src/ && npm install cookie-session@1.0.2
	cd src/ && npm install jade@0.30.x
	cd src/ && npm install exec-sync@0.1.x
	cd src/ && npm install htmlparser@1.7.x
	cd src/ && npm install body-parser@1.4.x

