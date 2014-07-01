
prefix=/usr/local


clean-npm:
	rm ./onair2_npm.tgz

dist-npm:
	tar cvzf ./onair2_npm.tgz ./src/ ./package.json


install:
	mkdr -p $(prefix)/onari2/
	cp -r /src/index.js $(prefix)/onari2/
	cp -r /src/app $(prefix)/onari2/
	cp -r /src/js $(prefix)/onari2/
	cp -r /src/public $(prefix)/onari2/
	[ -f $(prefix)/onari2/var/status.json ] || cp /src/templates/status.json $(prefix)/onari2/var/status.json

update:
