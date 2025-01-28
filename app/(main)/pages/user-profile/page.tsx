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
import { ProfileService } from '@/service/ProfileService';
import { UserProfileService } from '@/service/UserProfileService';
import { UserService } from '@/service/UserService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

const UserProfile = () => {
    let emptyUserProfile: Project.UserProfile = {
        profile: {description: ""},
        user: {
            name: "",
            login: "",
            password: "",
            email: ""
        }
    };

    const [userProfiles, setUserProfiles] = useState<Project.UserProfile[] | null>(null);
    const [userProfileDialog, setUserProfileDialog] = useState(false);
    const [deleteUserProfileDialog, setDeleteUserProfileDialog] = useState(false);
    const [deleteUserProfilesDialog, setDeleteUserProfilesDialog] = useState(false);
    const [userProfile, setUserProfile] = useState<Project.UserProfile>(emptyUserProfile);
    const [selectedUserProfiles, setSelectedUserProfiles] = useState<Project.UserProfile[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const userProfileService = useMemo(() => new UserProfileService(), []);
    const userService = useMemo(()=> new UserService(),[])
    const profileService = useMemo(()=> new ProfileService(),[])
    const [users, setUsers] = useState<Project.User[] >([])
    const [profiles, setProfiles] = useState<Project.Profile[]>([])

    useEffect(() => {
        if (!userProfiles) {
            userProfileService
                .getAll()
                .then((data) => {
                    console.log(data.data);
                    setUserProfiles(data.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [userProfileService, userProfiles]);

    useEffect(() => {
        if(userProfileDialog){
            userService.getAll()
            .then((response) => setUsers(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar a lista de usuário',
                    life: 3000
                });
            })
            profileService.getAll()
            .then((response) => setProfiles(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar a lista de perfis',
                    life: 3000
                });
            })

        }
    }, [userProfileDialog, profileService, userService])

    const openNew = () => {
        setUserProfile(emptyUserProfile);
        setSubmitted(false);
        setUserProfileDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserProfileDialog(false);
    };

    const hideDeleteProfileDialog = () => {
        setDeleteUserProfileDialog(false);
    };

    const hideDeleteProfilesDialog = () => {
        setDeleteUserProfilesDialog(false);
    };

    const saveUserProfile = () => {
        setSubmitted(true);

        if (!userProfile.id) {
            userProfileService
                .insert(userProfile)
                .then((data) => {
                    setUserProfileDialog(false);
                    setUserProfile(emptyUserProfile);
                    setUserProfiles(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil cadastrado com sucesso!',
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
            userProfileService
                .update(userProfile)
                .then((data) => {
                    setUserProfileDialog(false);
                    setUserProfile(emptyUserProfile);
                    setUserProfiles(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil atualizado com sucesso!',
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

    const editUserProfile = (profile: Project.UserProfile) => {
        setUserProfile({ ...profile });
        setUserProfileDialog(true);
    };

    const confirmDeleteUserProfile = (profile: Project.UserProfile) => {
        setUserProfile(profile);
        setDeleteUserProfileDialog(true);
    };

    const deleteUserProfile = () => {
        if (userProfile.id) {
            userProfileService
                .delete(userProfile.id)
                .then((response) => {
                    setDeleteUserProfileDialog(false);
                    setUserProfile(emptyUserProfile);
                    setUserProfiles(null)

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil excluído com sucesso!',
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
        setDeleteUserProfilesDialog(true);
    };

    const deleteSelectedUserProfiles = () => {
        Promise.all(
            selectedUserProfiles.map(async (profile) => {
                if (profile.id) {
                    await userProfileService.delete(profile.id);
                }
            })
        )
            .then((response) => {
                setUserProfiles([]);
                setSelectedUserProfiles([]);
                setDeleteUserProfilesDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfis deletados com sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                console.log(error.data.message),
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao deletar perfil' + error.data.message,
                        life: 3000
                    });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target?.value || '';

        setUserProfile((prevUserProfile) => ({
            ...prevUserProfile,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Deletar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUserProfiles || !(selectedUserProfiles as any).length} />
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

    const idBodyTemplate = (rowData: Project.UserProfile) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Project.UserProfile) => {
        return (
            <>
                <span className="p-column-title">Usuário</span>
                {rowData.user.name}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Project.UserProfile) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUserProfile(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUserProfile(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de perfis</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Procurar..." />
            </span>
        </div>
    );

    const profileDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUserProfile} />
        </>
    );
    const deleteProfileDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteProfileDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUserProfile} />
        </>
    );

    const deleteProfilesDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteProfilesDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUserProfiles} />
        </>
    );

    const onSelectProfileChange =(profile : Project.Profile) => {
        let _userProfile = { ...userProfile};
        _userProfile.profile = profile;
        setUserProfile(_userProfile)
    }

    const onSelectUserChange =(user : Project.User) => {
        let _userProfile = { ...userProfile};
        _userProfile.user = user;
        setUserProfile(_userProfile)
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={userProfiles}
                        selection={selectedUserProfiles}
                        onSelectionChange={(e) => setSelectedUserProfiles(e.value as any)}
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
                        <Column field="name" header="Nome" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={userProfileDialog} style={{ width: '450px' }} header="Detalhes do usuário" modal className="p-fluid" footer={profileDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="profile">Perfil</label>
                            <Dropdown
                            optionLabel='descricao' 
                            value={userProfile.profile}
                            options={profiles}
                            filter onChange={(e: DropdownChangeEvent) => onSelectProfileChange(e.value)
                                
                            }
                            placeholder='Selecione um perfil...'/>
                            
                            {submitted && !userProfile.profile && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="user">Usuário</label>
                            <Dropdown
                            optionLabel='name' 
                            value={userProfile.user}
                            options={users}
                            filter onChange={(e: DropdownChangeEvent) => onSelectUserChange(e.value)}
                            placeholder='Selecione um usuário...'/>
                
                            {submitted && !useruser.user && <small className="p-invalid">Descrição é obrigatório.</small>}
                        </div>
                    </Dialog>
                        

                    <Dialog visible={deleteUserProfileDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {userProfile && (
                                <span>
                                    Você realmente deseja excluir o perfil <b>{userProfile.profile.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUserProfilesDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProfilesDialogFooter} onHide={hideDeleteProfilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {userProfile && <span>Você realmente deseja excluir os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
