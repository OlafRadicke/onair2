version=1
prefix=/usr/local

clean-all: clean-npm clean-dist clean-tar

clean-npm:
	rm ./onari2-$(version)_npm.tgz

clean-dist:
	rm -Rf onari2-$(version)

clean-tar:
	rm ./onari2-$(version).tar.gz onari2-$(version)/

dist:
	mkdir -p                  onari2-$(version)/
	mkdir -p                  onari2-$(version)/app
	mkdir -p                  onari2-$(version)/app/controls
	mkdir -p                  onari2-$(version)/app/lib
	mkdir -p                  onari2-$(version)/app/manager
	mkdir -p                  onari2-$(version)/app/views
	mkdir -p                  onari2-$(version)/var
	cp src/index.js           onari2-$(version)/
	cp src/app/*.js           onari2-$(version)/app/
	cp src/app/controls/*.js  onari2-$(version)/app/controls/
	cp src/app/lib/*.js       onari2-$(version)/app/lib/
	cp src/app/manager/*.js   onari2-$(version)/app/manager/
	cp src/app/views/*.jade   onari2-$(version)/app/views/
	cp -r src/js              onari2-$(version)/
	cp -r src/public          onari2-$(version)/
	cp -r Makefile            onari2-$(version)/
	cp src/var/status.json    onari2-$(version)/var

dist-tar: dist
	tar -czf ./onari2-$(version).tar.gz ./onari2-$(version)/

dist-npm:
	tar -czf ./onari2-$(version)_npm.tgz ./onari2-$(version)/ ./package.json

uninstall:
	rm -Rf $(prefix)/onari2/index.js
	rm -Rf $(prefix)/onari2/app
	rm -Rf $(prefix)/onari2/node_modules
	rm -Rf $(prefix)/onari2/js

install:
	mkdir -p $(prefix)/onari2/
	cp -r src/index.js        $(prefix)/onari2/
	cp -r src/app             $(prefix)/onari2/
	cp -r src/js              $(prefix)/onari2/
	cp -r src/public          $(prefix)/onari2/
	cd $(prefix)/onari2/
	npm install express@3.2.x
	npm install body-parser@1.3.x
	npm install cookie-parser@1.1.x
	npm install cookie-session@1.0.2
	npm install jade@0.30.x
	npm install exec-sync@0.1.x
	npm install htmlparser@1.7.x
	npm install body-parser@1.4.x
	[ -f $(prefix)/onari2/var/status.json ] || cp /src/templates/status.json $(prefix)/onari2/var/status.json
	[ -f /usr/lib/systemd/system/onair2.service ] || cp systemd/onair2.service  /usr/lib/systemd/system/
	systemctl start onair2.service
	systemctl enable onair2.service

update: uninstall install
