/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { msg } from '../properties/frontend.js';
import '../config.js';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={"/layout/images/logo.png"} alt={msg.logo_sistema} height="20" className="mr-2" />
			{msg.nome_sistema} {msg.versao_sistema} - {msg.desc_sistema}
        </div>
    );
};

export default AppFooter;
