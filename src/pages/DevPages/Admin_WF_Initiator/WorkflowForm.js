import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Card,
    Container,
    Stack,
    Typography,
} from '@mui/material';

const WorkflowForm = (workflows) => {


    return (
        <>
            <Helmet>
                <title>Workflow Form</title>
            </Helmet>
            <Container>
                <Stack>
                    <Typography variant="h4" gutterBottom>
                        Workflow Form
                    </Typography>
                </Stack>
                <Card>
                </Card>
            </Container>
        </>
    );
};

export default WorkflowForm;
