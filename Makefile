test:
	./node_modules/.bin/mocha \
		--reporter spec ./test/test-spec.js

test-w:
	./node_modules/.bin/mocha --reporter spec --watch --timeout 20000 ./test/test-spec.js

.PHONY: test test-w