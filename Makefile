all:
	npx webpack

clean:
	@rm -r ./public

watch:
	npx webpack --watch

lint:
	npx eslint src

lint-fix:
	npx eslint src --fix

lint-watch:
	npx eslint src --watch

stylelint:
	npx stylelint assets/css

stylelint-fix:
	npx stylelint assets/css --fix
