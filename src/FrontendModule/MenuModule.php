<?php

/*
 * This file is part of Contao.
 *
 * (c) Leo Feyer
 *
 * @license LGPL-3.0-or-later
 */

namespace HeimrichHannot\MenuBundle\FrontendModule;

use Contao\BackendTemplate;
use Contao\ModuleNavigation;
use Contao\PageModel;
use Contao\System;
use Patchwork\Utf8;

class MenuModule extends ModuleNavigation
{
    use NavigationTrait;

    protected $strTemplate = 'mod_huh_menu';

    const TYPE = 'huh_menu';

    public function generate()
    {
        if (TL_MODE == 'BE') {
            /** @var BackendTemplate|object $objTemplate */
            $objTemplate = new \BackendTemplate('be_wildcard');

            $objTemplate->wildcard = '### ' . Utf8::strtoupper($GLOBALS['TL_LANG']['FMD'][$this->type][0]) . ' ###';
            $objTemplate->title    = $this->headline;
            $objTemplate->id       = $this->id;
            $objTemplate->link     = $this->name;
            $objTemplate->href     = 'contao/main.php?do=themes&amp;table=tl_module&amp;act=edit&amp;id=' . $this->id;

            return $objTemplate->parse();
        }

        $strBuffer = parent::generate();

        return ($this->Template->items != '') ? $strBuffer : '';
    }

    protected function compile()
    {
        // **start** taken from ModuleNavigation::compile (can be removed after https://github.com/contao/contao/issues/155 has been implemented)

        /** @var PageModel $objPage */
        global $objPage;

        // Set the trail and level
        if ($this->defineRoot && $this->rootPage > 0) {
            $trail = [$this->rootPage];
            $level = 0;
        } else {
            $trail = $objPage->trail;
            $level = ($this->levelOffset > 0) ? $this->levelOffset : 0;
        }

        $lang = null;
        $host = null;

        // Overwrite the domain and language if the reference page belongs to a differnt root page (see #3765)
        if ($this->defineRoot && $this->rootPage > 0) {
            $objRootPage = \PageModel::findWithDetails($this->rootPage);

            // Set the language
            if (\Config::get('addLanguageToUrl') && $objRootPage->rootLanguage != $objPage->rootLanguage) {
                $lang = $objRootPage->rootLanguage;
            }

            // Set the domain
            if ($objRootPage->rootId != $objPage->rootId && $objRootPage->domain != '' && $objRootPage->domain != $objPage->domain) {
                $host = $objRootPage->domain;
            }
        }

        $this->Template->request        = ampersand(\Environment::get('indexFreeRequest'));
        $this->Template->skipId         = 'skipNavigation' . $this->id;
        $this->Template->skipNavigation = \StringUtil::specialchars($GLOBALS['TL_LANG']['MSC']['skipNavigation']);

        // **end**

        // add module data to nav template
        $this->Template->items = $this->renderNavigation($trail[$level], 1, $host, $lang, $this);

        $stringUtil = System::getContainer()->get('huh.utils.string');

        $dataAttributeFields = [
            'huhMenu_maxTriggerLevel',
            'huhMenu_openDelay',
            'huhMenu_closeDelay',
            'huhMenu_openingDuration',
            'huhMenu_closingDuration',
        ];

        $dataAttributes = [];

        foreach ($dataAttributeFields as $name) {
            $unprefixed = preg_replace('@^huhMenu_@i', '', $name);

            $dataAttributes[$stringUtil->camelCaseToDashed($unprefixed)] = $this->Template->{$name};
        }

        $this->Template->dataAttributes = $dataAttributes;
    }
}
