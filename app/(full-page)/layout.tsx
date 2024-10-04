import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';
import { msg } from '../../properties/frontend.js';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: msg.nome_sistema + msg.versao_sistema,
    description: msg.desc_sistema
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
