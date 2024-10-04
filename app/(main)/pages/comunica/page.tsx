/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '../../../../types/types';
import { ComunicaService } from '../../../../service/ComunicaService';

const Comunica = () => {
    let comunicaVazio: Projeto.Comunica = {
        id: 0,
        titulo: '',
        descricao: '',
        dataCadastro: ''
    };

	const [comunicados, setComunicados] = useState<Projeto.Comunica[] | null>(null);
    const [comunicaDialog, setComunicaDialog] = useState(false);
    const [deleteComunicaDialog, setDeleteComunicaDialog] = useState(false);
    const [deleteComunicadosDialog, setDeleteComunicadosDialog] = useState(false);
    const [comunica, setComunica] = useState<Projeto.Comunica>(comunicaVazio);
    const [selectedComunicados, setSelectedComunicados] = useState<Projeto.Comunica[]>([]);
    const [submitted, setSubmitted] = useState(false);
	const [showRequired, setShowRequired] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const comunicaService = useMemo(() => new ComunicaService(), []);

    useEffect(() => {
        if (!comunicados) {
            comunicaService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setComunicados(response.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }, [comunicaService, comunicados]);

    const openNew = () => {
        setComunica(comunicaVazio);
        setSubmitted(false);
        setComunicaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setComunicaDialog(false);
    };

    const hideDeleteComunicaDialog = () => {
        setDeleteComunicaDialog(false);
    };

    const hideDeleteComunicadosDialog = () => {
        setDeleteComunicadosDialog(false);
    };

    const saveComunica = () => {
		validate(comunica);
        if (submitted && !comunica.id) {
            comunicaService.inserir(comunica)
                .then((response) => {
                    setComunicaDialog(false);
                    setComunica(comunicaVazio);
                    setComunicados(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Comunicado cadastrado com sucesso!'
                    });
                }).catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar!' + error.data.message
                    })
                });
        } else if (submitted){
            comunicaService.alterar(comunica)
                .then((response) => {
                    setComunicaDialog(false);
                    setComunica(comunicaVazio);
                    setComunicados(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Comunicado alterado com sucesso!'
                    });
                }).catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar!' + error.data.message
                    })
                })
        }
    }


	const validate = (values) => {
		if(!values.titulo || !values.descricao){
			setSubmitted(false);
			setShowRequired(true);
		}else{
			setSubmitted(true);
			setShowRequired(false);
		}		
	}
	
    const editComunica = (comunica: Projeto.Comunica) => {
        setComunica({ ...comunica });
        setComunicaDialog(true);
    };

    const confirmDeleteComunica = (comunica: Projeto.Comunica) => {
        setComunica(comunica);
        setDeleteComunicaDialog(true);
    };

    const deleteComunica = () => {
        if (comunica.id) {
            comunicaService.excluir(comunica.id).then((response) => {
                setComunica(comunicaVazio);
                setDeleteComunicaDialog(false);
                setComunicados(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Comunicado Deletado com Sucesso!',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar o comunicado!',
                    life: 3000
                });
            });
        }
    };

    const exportCSV = () => {
		alert("Exportando");
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteComunicadosDialog(true);
    };

    const deleteSelectedComunicados = () => {

        Promise.all(selectedComunicados.map(async (_comunica) => {
            if (_comunica.id) {
                await comunicaService.excluir(_comunica.id);
            }
        })).then((response) => {
            setComunicados(null);
            setSelectedComunicados([]);
            setDeleteComunicadosDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Comunicados Deletados com Sucesso!',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar comunicados!',
                life: 3000
            })
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';

		let _comunica = { ...comunica };
        _comunica[`${name}`] = val;

        setComunica(_comunica);
        // setComunica(prevComunica => ({
        //     ...prevComunica,
        //     [name]: val,
        //   }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedComunicados || !(selectedComunicados as any).length} />
                </div>
            </React.Fragment>
        );
    };

	const onUpload = () => {
		alert("Importando");
	    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
	};

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
				<Toast ref={toast}></Toast>
				<FileUpload mode="basic" className="mr-2 inline-block" name="demo[]" accept="image/*" maxFileSize={1000000} url='/frontend/app/upload' onUpload={onUpload} auto chooseLabel="Browse" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Comunica) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const tituloBodyTemplate = (rowData: Projeto.Comunica) => {
        return (
            <>
                <span className="p-column-title">Título</span>
                {rowData.titulo}
            </>
        );
    };

    const descricaoBodyTemplate = (rowData: Projeto.Comunica) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
            </>
        );
    };

    const dataCriacaoBodyTemplate = (rowData: Projeto.Comunica) => {
        return (
            <>
                <span className="p-column-title">Data da Criação</span>
                {rowData.dataCadastro}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Comunica) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editComunica(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteComunica(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Comunicados Cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const comunicaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveComunica} />
        </>
    );
    const deleteComunicaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteComunicaDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteComunica} />
        </>
    );
    const deleteComunicadosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteComunicadosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedComunicados} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={comunicados}
                        selection={selectedComunicados}
                        onSelectionChange={(e) => setSelectedComunicados(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} comunicados"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum comunicado encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="titulo" header="Título" sortable body={tituloBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable body={descricaoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
					<Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
					
                    <Dialog visible={comunicaDialog} style={{ width: '450px' }} header="Detalhes dos Comunicados" modal className="p-fluid" footer={comunicaDialogFooter} onHide={hideDialog}>
						<pre>{JSON.stringify(comunica,undefined, 2)} </pre>
                        <div className="field">
                            <label htmlFor="titulo">Título</label>
                            <InputText
                                id="titulo"
                                value={comunica.titulo}
                                onChange={(e) => onInputChange(e, 'titulo')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': showRequired && !comunica.titulo
                                })}
                            />
                            {showRequired && !comunica.titulo && <small className="p-invalid">Título é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="login">Descrição</label>
                            <InputText
                                id="descricao"
                                value={comunica.descricao}
                                onChange={(e) => onInputChange(e, 'descricao')}
                                required
                                className={classNames({
                                    'p-invalid': showRequired && !comunica.descricao
                                })}
                            />
                            {showRequired && !comunica.descricao && <small className="p-invalid">Descricao é obrigatória.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteComunicaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteComunicaDialogFooter} onHide={hideDeleteComunicaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {comunica && (
                                <span>
                                    Você realmente deseja excluir o comunicado <b>{comunica.titulo}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteComunicadosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteComunicadosDialogFooter} onHide={hideDeleteComunicadosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {comunica && <span>Você realmente deseja excluir os comunicados selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Comunica;