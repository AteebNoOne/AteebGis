import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Card,
    Container,
    Stack,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Divider,
    Button,
} from '@mui/material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import axios from 'axios';

const GroupList = ({ groups, onSelectGroup }) => (
    <TableContainer>
        <Table style={{ overflow: 'scroll' }}>
            <TableHead>
                {groups.map((group) => (
                    <>
                        <TableRow key={group.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelectGroup(group.groupBy)}>
                            <TableCell><AccountTreeOutlinedIcon /></TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>
                                {group.groupBy.toUpperCase()}
                            </TableCell>
                        </TableRow>
                        <Divider style={{ margin: "3px" }} />
                    </>
                ))}
            </TableHead>
        </Table>
    </TableContainer>
);

const PrefixList = ({ workflows, onSelectPrefix }) => (
    <TableContainer>
        <Table style={{ overflow: 'scroll' }}>
            <TableHead>
                {workflows.map((workflow) => (
                    <>
                        <TableRow key={workflow.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelectPrefix(workflow.form_name)}>
                            <TableCell><FlagOutlinedIcon /></TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>
                                {workflow.workflow_prefix}
                            </TableCell>
                        </TableRow>
                        <Divider style={{ margin: "2px" }} />
                    </>
                ))}
            </TableHead>
        </Table>
    </TableContainer>
);

const AdminWorkflowComponent = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedPrefix, setSelectedPrefix] = useState(null);
    const [formName, setFormName] = useState('');
    const [workflows, setWorkflows] = useState([])
    const apiUrl = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`${apiUrl}/group_by`);
                setGroups(response.data);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        fetchGroups();
    }, []);

    const selectGroup = async (group) => {
        try {
            const response = await axios.get(`${apiUrl}/workflow?group_by=${group}`);
            const workflowData = response.data;
            setSelectedGroup(group);
            setSelectedPrefix(null); // Reset selectedPrefix when a group is selected
            setFormName(''); // Reset formName
            setWorkflows(workflowData);
        } catch (error) {
            console.error("Error selecting group:", error);
        }
    };

    const selectPrefix = (prefix) => {
        setSelectedPrefix(prefix);
        setFormName('');
    };

    const navigateToWorkflowDetails = (form_name) => {
        setFormName(form_name);
    };

    const goBack = () => {
        if (selectedPrefix) {
            setSelectedPrefix(null);
            setFormName('');
        } else if (selectedGroup) {
            setSelectedGroup(null);
        }
    };

    return (
        <>
            <Helmet>
                <title>Workflow Admin Initiator</title>
            </Helmet>
            <Container>
                <Stack>
                    <Typography variant="h4" gutterBottom>
                        Workflow Admin Initiator
                    </Typography>
                </Stack>
                <Card>
                    {(!selectedGroup && !selectedPrefix) && (
                        <GroupList groups={groups} onSelectGroup={selectGroup} />
                    )}
                    {selectedGroup && !selectedPrefix && (
                        <PrefixList workflows={workflows} onSelectPrefix={selectPrefix} />
                    )}
                    {selectedPrefix && (
                        <div>
                            <Typography variant="h5">Selected Form: {formName}</Typography>
                            {/* Add your form rendering component here */}
                        </div>
                    )}
                    {selectedGroup || selectedPrefix ? (
                        <Button onClick={goBack}>Back</Button>
                    ) : null}
                </Card>
            </Container>
        </>
    );
};

export default AdminWorkflowComponent;
