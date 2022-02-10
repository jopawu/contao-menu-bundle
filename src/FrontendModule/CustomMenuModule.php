<?php

/*
 * Copyright (c) 2022 Heimrich & Hannot GmbH
 *
 * @license LGPL-3.0-or-later
 */

namespace HeimrichHannot\MenuBundle\FrontendModule;

use Contao\BackendTemplate;
use Contao\ModuleCustomnav;

class CustomMenuModule extends ModuleCustomnav
{
    const TYPE = 'huh_custom_menu';
    protected $strTemplate = 'mod_huh_custom_menu';

    public function generate()
    {
        if (TL_MODE == 'BE') {
            /** @var BackendTemplate|object $objTemplate */
            $objTemplate = new \BackendTemplate('be_wildcard');

            $objTemplate->wildcard = '### '.$GLOBALS['TL_LANG']['FMD'][$this->type][0].' ###';
            $objTemplate->title = $this->headline;
            $objTemplate->id = $this->id;
            $objTemplate->link = $this->name;
            $objTemplate->href = 'contao/main.php?do=themes&amp;table=tl_module&amp;act=edit&amp;id='.$this->id;

            return $objTemplate->parse();
        }

        $strBuffer = parent::generate();

        return ('' != $this->Template->items) ? $strBuffer : '';
    }

    protected function compile()
    {
        parent::compile();
    }
}
