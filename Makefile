clean-npm:
	rm ./onair2_npm.tgz

dist-npm:
	tar cvzf ./onair2_npm.tgz ./src/ ./package.json
