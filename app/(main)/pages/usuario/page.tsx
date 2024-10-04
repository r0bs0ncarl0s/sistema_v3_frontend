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
import { Password } from 'primereact/password';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '../../../../types/types';
import { UsuarioService } from '../../../../service/UsuarioService';
import { msg } from '../../../../properties/frontend.js';

const Usuario = () => {
    let usuarioVazio: Projeto.Usuario = {
        id: 0,
        nome: '',
        login: '',
        senha: '',
		situacao: 'A',
        email: ''
    };

    const [usuarios, setUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = useMemo(() => new UsuarioService(), []);

    useEffect(() => {
        if (!usuarios) {
            usuarioService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setUsuarios(response.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }, [usuarioService, usuarios]);

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };

    const saveUsuario = () => {
        setSubmitted(true);

        if (!usuario.id) {
            usuarioService.inserir(usuario)
                .then((response) => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(null);
                    toast.current?.show({
                        severity: "info",
                        summary: msg.sucesso,
                        detail: msg.usuario + " " +  msg.cadastrado_com_sucesso
                    });
                }).catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: "error",
                        summary: msg.error,
                        detail: msg.erro_inserir + " " +  error.data.message
                    })
                });
        } else {
            usuarioService.alterar(usuario)
                .then((response) => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(null);
                    toast.current?.show({
                        severity: "info",
                        summary: msg.sucesso,
                        detail: msg.usuario + " " +  msg.alterado_com_sucesso
                    });
                }).catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: "error",
                        summary: msg.error,
                        detail: msg.erro_alterar + " " +  error.data.message
                    })
                })
        }
    }

    const editUsuario = (usuario: Projeto.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Projeto.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        if (usuario.id) {
            usuarioService.excluir(usuario.id).then((response) => {
                setUsuario(usuarioVazio);
                setDeleteUsuarioDialog(false);
                setUsuarios(null);
                toast.current?.show({
                    severity: "success",
                    summary: msg.sucesso,
                    detail: msg.usuario + " " + msg.excluido_com_sucesso,
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: "error",
                    summary: msg.error,
                    detail: msg.erro_excluir + " " +  error.data.message,
                    life: 3000
                });
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

    const deleteSelectedUsuarios = () => {

        Promise.all(selectedUsuarios.map(async (_usuario) => {
            if (_usuario.id) {
                await usuarioService.excluir(_usuario.id);
            }
        })).then((response) => {
            setUsuarios(null);
            setSelectedUsuarios([]);
            setDeleteUsuariosDialog(false);
            toast.current?.show({
                severity: "success",
                summary: msg.sucesso,
                detail: msg.usuarios + " " +  msg.excluido_com_sucesso,
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: "error",
                summary: msg.error,
                detail: msg.erro_excluir + " " +  error.data.message,
                life: 3000
            })
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;
		
        setUsuario(_usuario);
        // setUsuario(prevUsuario => ({
        //     ...prevUsuario,
        //     [name]: val,
        //   }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label={msg.novo} icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label={msg.excluir} icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">{msg.codigo}</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">{msg.nome}</span>
                {rowData.nome}
            </>
        );
    };

    const loginBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">{msg.login}</span>
                {rowData.login}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">{msg.email}</span>
                {rowData.email}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{msg.usuarios} {msg.cadastrados}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage={msg.nenhum + " " + msg.usuario + " " + msg.encontrado}
                        header={header}
                        responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header={msg.codigo} sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header={msg.nome} sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="login" header={msg.login} sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header={msg.email} sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
					<Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header={msg.detalhes + " " + msg.de + " " + msg.usuario} modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">{msg.nome}</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">{msg.nome} {msg.campo_obrigatorio} </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="login">{msg.login}</label>
                            <InputText
                                id="login"
                                value={usuario.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.login
                                })}
                            />
                            {submitted && !usuario.login && <small className="p-invalid">{msg.login} {msg.campo_obrigatorio} </small>}
                        </div>
                        <div className="field">
                            <label htmlFor="senha">{msg.senha}</label>
                            <Password inputId="senha"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">{msg.senha} {msg.campo_obrigatorio}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">{msg.email}</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">{msg.email} {msg.campo_obrigatorio}</small>}
                        </div>
                    </Dialog>
                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    {msg.vc_deseja_excluir} {msg.o} {msg.usuario} <b>{usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>{msg.vc_deseja_excluir} {msg.os} {msg.usuarios} {msg.selecionados}?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Usuario;
