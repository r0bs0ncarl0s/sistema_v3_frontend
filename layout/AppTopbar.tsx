/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { msg } from '../properties/frontend.js';
import '../config.js';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

	const usuario_logado = localStorage.getItem('USUARIO_LOGADO');
	
    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));
    
    const logout = () => {
        localStorage.removeItem('TOKEN_APLICACAO_FRONTEND');
		localStorage.removeItem('USUARIO_LOGADO');
    }

    return (
        <div className="layout-topbar">
            <Link href="/">
                <img src={"/layout/images/abreviacao_nome.png"} width="250px" height="60px" alt="logo" />
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
			{msg.usuario}: {usuario_logado}	
            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
				<button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                </button>
                <a href="/"  onClick={() => logout()}>
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-sign-out"></i>
                        <span>{msg.sair}</span>
                    </button>
                </a>
            </div>						
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
