/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '../../types/types';
import { ChartData, ChartOptions } from 'chart.js';
import { ComunicaService } from '../../service/ComunicaService';
import { msg } from '../../properties/frontend.js';

const Dashboard = () => {

	/*let comunicaVazio: Projeto.Comunica = {
	        id: 0,
	        titulo: '',
	        descricao: '',
			dataCadastro: ''
	    };*/
	
	const [comunicados, setComunicados] = useState<Projeto.Comunica[]>([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
	const toast = useRef<Toast>(null);
	const dt = useRef<DataTable<any>>(null);
	const comunicaService = useMemo(() => new ComunicaService(), []);
    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

	useEffect(() => {
	    if (!comunicados || comunicados.length == 0) {	        
			comunicaService.listarTodos()
	            .then((response) => {
	                console.log(response.data);
	                setComunicados(response.data);
	            }).catch((error) => {
	                console.log(error);
	            })
	    }
	}, [comunicaService, comunicados]);
	
    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    return (
        <div className="grid">
            <div>
                <div className="card">
                    <h5>Comunicados</h5>
                    {/**/}
					<DataTable value={comunicados} rows={5} paginator responsiveLayout="scroll">
						<Column field="titulo" header={msg.titulo} sortable style={{ width: '20%' }} />    
						<Column field="descricao" header={msg.descricao} sortable style={{ width: '70%' }} />
                        <Column field="dataCadastro" header={msg.data + " " + msg.do + " " + msg.cadastro} sortable style={{ width: '10%' }} />
                    </DataTable>
                </div>
            </div>    
        </div>
    );
};

export default Dashboard;
