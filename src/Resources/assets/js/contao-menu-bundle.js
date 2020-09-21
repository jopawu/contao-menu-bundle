import '@hundh/contao-utils-bundle';

class MenuBundle {

    static init() {
        MenuBundle.initMenu();
    }

    static initMenu() {
        document.querySelectorAll('.mod_huh_menu').forEach((menu) => {
            let maxTriggerLevel = menu.getAttribute('data-max-trigger-level'),
                closeDelay = menu.getAttribute('data-close-delay'),
                triggerActivatedLinkClasses = [];

            if (maxTriggerLevel == 0) {
                triggerActivatedLinkClasses.push('a.submenu');
            } else {
                for (let i = 1; i <= maxTriggerLevel; i++) {
                    triggerActivatedLinkClasses.push('.level_' + i + ' > .submenu > a.submenu');
                }
            }

            menu.querySelectorAll(triggerActivatedLinkClasses).forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    if (window.navigator.maxTouchPoints == 0) {
                        let url = link.getAttribute('href');

                        if (url !== null && url.length > 0) {
                            location.href = link.href;
                        }
                    }
                });

                link.addEventListener('mouseover', () => {
                    MenuBundle.openSubmenu(menu, link);
                });

                link.addEventListener('touchstart', () => {
                    MenuBundle.openSubmenu(menu, link);
                });

                link.addEventListener('mouseleave', (e) => {
                    if (MenuBundle.isElementCurrentlyHovered(link) || MenuBundle.isElementCurrentlyHovered(link.nextElementSibling)) {
                        return;
                    }

                    MenuBundle.addClosingClassToElements([link, link.nextElementSibling]);

                    setTimeout(() => {
                        MenuBundle.removeClassFromElements('closing', [link, link.nextElementSibling])

                        if (MenuBundle.isElementCurrentlyHovered(link) || MenuBundle.isElementCurrentlyHovered(link.nextElementSibling)) {
                            return;
                        }

                        MenuBundle.removeClassFromElements('open', [link, link.nextElementSibling])
                        MenuBundle.removeMenuOpenState(menu);
                    }, closeDelay);
                });

                link.nextElementSibling.addEventListener('mouseleave', (e) => {
                    if (MenuBundle.isElementCurrentlyHovered(link) || MenuBundle.isElementCurrentlyHovered(link.nextElementSibling)) {
                        return;
                    }

                    setTimeout(() => {
                        if (MenuBundle.isElementCurrentlyHovered(link) || MenuBundle.isElementCurrentlyHovered(link.nextElementSibling)) {
                            return;
                        }

                        MenuBundle.removeClassFromElements('open', [e.target, link])
                        MenuBundle.removeMenuOpenState(menu);
                    }, closeDelay);
                });
            });

            menu.addEventListener('mouseleave', (e) => {
                setTimeout(() => {
                    if (MenuBundle.isElementCurrentlyHovered(menu)) {
                        return;
                    }

                    // remove all open classes
                    menu.querySelectorAll('.open').forEach((element) => {
                        element.classList.remove('open');
                        MenuBundle.removeMenuOpenState(menu);
                    });
                }, closeDelay);
            });

            document.querySelector('body').addEventListener('touchstart', (e) => {
                if (e.target.closest('.mod_huh_menu') !== null) {
                    return;
                }

                setTimeout(() => {
                    if (MenuBundle.isElementCurrentlyHovered(menu)) {
                        return;
                    }

                    // remove all open classes
                    menu.querySelectorAll('.open').forEach((element) => {
                        element.classList.remove('open');
                    });
                }, closeDelay);
            });
        });
    }

    static openSubmenu(menu, link) {
        let openDelay = menu.getAttribute('data-open-delay') ? menu.getAttribute('data-open-delay') : 0;

        if (link.classList.contains('open')) {
            return;
        }

        MenuBundle.addOpeningClassToElements([menu, link, link.nextElementSibling]);

        setTimeout(() => {
            MenuBundle.removeClassFromElements('opening', [menu, link, link.nextElementSibling])

            if (!MenuBundle.isElementCurrentlyHovered(link)) {
                return;
            }

            if (!menu.classList.contains('open')) {
                menu.classList.add('open');

                document.dispatchEvent(new CustomEvent('huhMenu:opened', {detail: menu, bubbles: true, cancelable: true}));
            }

            let openedParents = [];

            utilsBundle.dom.getAllParentNodes(link).forEach((element) => {
                if (element.classList.contains('open')) {
                    openedParents.push(element);
                }
            });

            // remove all open classes except those which are parents
            menu.querySelectorAll('.open').forEach((element) => {
                if (openedParents.indexOf(element) < 0) {
                    let remove = true;

                    Array.from(element.parentNode.children).forEach(child => {
                        if (openedParents.indexOf(child) < 0) {
                            remove = false;
                        }
                    });

                    if (remove) {
                        element.classList.remove('open');
                    }
                }
            });

            if (!link.classList.contains('open')) {
                link.classList.add('open');
            }

            if (!link.nextElementSibling.classList.contains('open')) {
                link.nextElementSibling.classList.add('open');
            }
        }, openDelay);
    }

    static isElementCurrentlyHovered(element) {
        let found = false;

        document.querySelectorAll( ':hover' ).forEach((hoveredElement) => {
            if (hoveredElement === element) {
                found = true;
            }
        });

        return found;
    }

    static removeMenuOpenState(menu) {
        let openedElements = menu.querySelectorAll('.open');

        if (openedElements.length < 1) {
            menu.classList.remove('open');

            document.dispatchEvent(new CustomEvent('huhMenu:closed', {detail: menu, bubbles: true, cancelable: true}));
        }
    }

    static addOpeningClassToElements(elements) {
        elements.forEach((element) => {
            if (!element.classList.contains('opening') && !element.classList.contains('open')) {
                element.classList.add('opening');
            }
        });
    }

    static removeClassFromElements(className, elements) {
        elements.forEach((element) => {
            element.classList.remove(className);
        });
    }

    static addClosingClassToElements(elements) {
        elements.forEach((element) => {
            if (!element.classList.contains('closing') && element.classList.contains('open')) {
                element.classList.add('closing');
            }
        });
    }
}

export {MenuBundle};
