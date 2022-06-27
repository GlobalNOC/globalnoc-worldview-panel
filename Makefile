  
VERSION = 1.2.0
NAME = globalnoc-worldview-panel

rpm:	dist
		rpmbuild -ta dist/$(NAME)-$(VERSION).tar.gz
clean:
		rm -rf dist/$(NAME)-$(VERSION)/
		rm -rf dist
dist:	clean
		rm -rf dist/$(NAME)-$(VERSION)
		mkdir -p dist/$(NAME)-$(VERSION)
		cp -r  src package.json package-lock.json tsconfig.json yarn.lock jest.config.js .prettierrc.js README.md LICENSE CHANGELOG.md $(NAME).spec dist/$(NAME)-$(VERSION)/
		cd dist; tar -czvf $(NAME)-$(VERSION).tar.gz $(NAME)-$(VERSION)/ 
