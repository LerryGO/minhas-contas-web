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
import { UserService } from '../../../../service/UserService';

const User = () => {
    let emptyUser: Project.User = {
        name: '',
        login: '',
        password: '',
        email: ''
    };

    const [users, setUsers] = useState<Project.User[] | null>(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<Project.User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<Project.User[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const userService = useMemo(() => new UserService(), []);

    useEffect(() => {
        if (!users) {
            userService
                .getAll()
                .then((data) => {
                    console.log(data.data);
                    setUsers(data.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [userService, users]);

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (!user.id) {
            userService
                .insert(user)
                .then((data) => {
                    setUserDialog(false);
                    setUser(emptyUser);
                    setUsers(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Usuário cadastrado com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error.data.message),
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Erro!',
                            detail: 'Erro ao salvar' + error.data.message,
                            life: 3000
                        });
                });
        } else {
            userService
                .update(user)
                .then((data) => {
                    setUserDialog(false);
                    setUser(emptyUser);
                    setUsers(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Usuário atualizado com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error.data.message),
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Erro!',
                            detail: 'Erro ao alterar' + error.data.message,
                            life: 3000
                        });
                });
        }
    };

    const editUser = (user: Project.User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: Project.User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        if (user.id) {
            userService
                .delete(user.id)
                .then((response) => {
                    setDeleteUserDialog(false);
                    setUser(emptyUser);

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Usuário excluído com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Erro ao excluir' + error.message,
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        Promise.all(
            selectedUsers.map(async (user) => {
                if (user.id) {
                    await userService.delete(user.id);
                }
            })
        )
            .then((response) => {
                setUsers([]);
                setSelectedUsers([]);
                setDeleteUsersDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuários deletados com sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                console.log(error.data.message),
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao deletar usuários' + error.data.message,
                        life: 3000
                    });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target?.value || '';

        setUser((prevUser) => ({
            ...prevUser,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Deletar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !(selectedUsers as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Project.User) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Project.User) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const loginBodyTemplate = (rowData: Project.User) => {
        return (
            <>
                <span className="p-column-title">Login</span>
                {rowData.login}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Project.User) => {
        return (
            <>
                <span className="p-column-title">E-mail</span>
                {rowData.email}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Procurar..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUser} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );

    const deleteUsersDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum usuário encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="Detalhes do usuário" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText
                                id="name"
                                value={user.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.name
                                })}
                            />
                            {submitted && !user.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <InputText
                                id="login"
                                value={user.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.login
                                })}
                            />
                            {submitted && !user.login && <small className="p-invalid">Login é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="password">Senha</label>
                            <InputText
                                id="password"
                                value={user.password}
                                onChange={(e) => onInputChange(e, 'password')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.password
                                })}
                            />
                            {submitted && !user.password && <small className="p-invalid">Senha é obrigatória.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <InputText
                                id="email"
                                value={user.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.email
                                })}
                            />
                            {submitted && !user.email && <small className="p-invalid">E-mail é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Você realmente deseja excluir o usuários <b>{user.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Você realmente deseja excluir os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default User;
