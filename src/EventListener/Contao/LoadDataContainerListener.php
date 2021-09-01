<?php

namespace HeimrichHannot\MenuBundle\EventListener\Contao;

use HeimrichHannot\UtilsBundle\Container\ContainerUtil;

class LoadDataContainerListener {
    /**
     * @var ContainerUtil
     */
    private $containerUtil;

    public function __construct(ContainerUtil $containerUtil)
    {
        $this->containerUtil = $containerUtil;
    }

    public function __invoke($table)
    {
        /**
         * JS
         */
        if ($this->containerUtil->isFrontend()) {
            $GLOBALS['TL_JAVASCRIPT']['contao-menu-bundle'] = 'bundles/contaomenu/contao-menu-bundle.js';
        }

        /**
         * CSS
         */
        if ($this->containerUtil->isFrontend()) {
            $GLOBALS['TL_CSS']['contao-menu-bundle'] = 'bundles/contaomenu/contao-menu-bundle.css';
        }
    }
}
