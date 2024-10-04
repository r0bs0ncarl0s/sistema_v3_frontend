/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';
import { msg } from '../properties/frontend.js';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: msg.apoio,
            items: [{ label: msg.importacao, icon: 'pi pi-fw pi-id-card', to: '' },
				    { label: msg.download, icon: 'pi pi-fw pi-id-card', to: '' },
					{ label: msg.exportacao, icon: 'pi pi-fw pi-id-card', to: '' },
					{ label: msg.parametrizacao, icon: 'pi pi-fw pi-id-card', to: '' },
					{
	                    label: msg.informacoes + " " + msg.basicas,
	                    icon: 'pi pi-fw pi-user',
	                    items: 	[
	                        		{label: msg.comunica, icon: 'pi pi-fw pi-id-card', to: '/pages/comunica'},
									{label: msg.usuario, icon: 'pi pi-fw pi-id-card', to: '/pages/usuario'},
	                        	]
                	}
			]
        },
		{
            label: msg.plano + " " + msg.estrategico,
            items: [{ label: msg.planos, icon: 'pi pi-fw pi-id-card', to: '' },
					{ label: msg.ranking, icon: 'pi pi-fw pi-id-card', to: '' },
					{
	                    label: msg.apoio,
	                    icon: 'pi pi-fw pi-user',
	                    items: 	[
	                        		{label: msg.tipo + " " + msg.elemento, icon: 'pi pi-fw pi-id-card', to: ''},
									{label: msg.elemento, icon: 'pi pi-fw pi-id-card', to: ''},
									{label: msg.indicadores, icon: 'pi pi-fw pi-id-card', to: ''},
	                        	]
                	}
			]
		},
        {
            label: msg.planejamento,
            items: [{ label: msg.parametrizacao, icon: 'pi pi-fw pi-id-card', to: '' }]
        },
        {
            label: msg.execucao,
            items: [{ label: msg.parametrizacao, icon: 'pi pi-fw pi-id-card', to: '' }]
        },
		{
            label: msg.controle,
            items: [{ label: msg.parametrizacao, icon: 'pi pi-fw pi-id-card', to: '' }]
        },
        {
            label: msg.siplad + msg.gerencial,
            items: [{ label: msg.parametrizacao, icon: 'pi pi-fw pi-id-card', to: '' }]
        },
		{
            label: msg.relatorio,
            items: [{ label: msg.extracao + " " + msg.comrj, icon: 'pi pi-fw pi-id-card', to: '' },
				    { label: msg.extracao + " " + msg.singra, icon: 'pi pi-fw pi-id-card', to: '' }
			]
        },
        {
            label: msg.gru,
            items: [{ label: msg.parametrizacao, icon: 'pi pi-fw pi-id-card', to: '' }]
        }
	];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
