import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import './typewriter.css'

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
        theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const Container = styled('div')({
    width: '100%',
});

const retrieveLastAnimatedLineIndex = () => {
    const storedIndex = localStorage.getItem('lastAnimatedLineIndex');
    return storedIndex ? parseInt(storedIndex) : 0;
};


function SwipeableEdgeDrawer(props) {
    const { window } = props;
    const { connected } = props;
    const {fileUrl} = props;
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsWithSuccess, setLogsWithSuccess] = useState([]);

    const [currentLineIndex, setCurrentLineIndex] = useState(retrieveLastAnimatedLineIndex);
    const container = window !== undefined ? () => window.document.body : undefined;
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const fetchLogs = async () => {
        if(!fileUrl || fileUrl === '' ){
            return;
        }
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            const newLogs = text.split('\n');

            if (newLogs.length > logs.length) {
                setLogs(newLogs);

                const newLogsWithSuccess = newLogs.map(log => log.includes('Success'));
                setLogsWithSuccess(newLogsWithSuccess);
            }
        } catch (error) {
            //console.error('Error fetching logs:', error);
        }
    };


    const animateLogs = () => {
        const animatedLogs = logs.slice(currentLineIndex);

        animatedLogs.forEach((log, index) => {
            setTimeout(() => {
                setCurrentLineIndex((prevIndex) => {
                    const newIndex = prevIndex + 1;
                    localStorage.setItem('lastAnimatedLineIndex', newIndex.toString());
                    return newIndex;
                });
                if (log.includes('Success')) {
                    const logElement = document.querySelector(`.log-${index}`);
                    if (logElement) {
                        logElement.classList.add('greenText');
                    }
                }
            }, index * 1000); // Adjust the timing as needed
        });
    };

    useEffect(() => {
        if(!fileUrl || fileUrl === '' ){
            return;
        }
        const intervalId = setInterval(fetchLogs, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if(!fileUrl || fileUrl === '' ){
            return;
        }
        if (logs.length > currentLineIndex) {
            animateLogs();
        }
    }, [logs, currentLineIndex]);


    return (
        <Root>
            <Global />
            <CssBaseline />
            <Global
                styles={css`
          .MuiDrawer-root > .MuiPaper-root {
            height: calc(90% - ${drawerBleeding}px);
            overflow: visible;
          }
        `}
            />
            <Box sx={{ textAlign: 'center', pt: 1 }}>
                <Button onClick={toggleDrawer(true)} disabled={!connected}>Email logs</Button>
            </Box>
            <Container>
                <SwipeableDrawer
                    container={container}
                    anchor="bottom"
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={false}
                    allowSwipeInChildren={true}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    classes={{
                        paper: 'custom-drawer-paper',
                    }}
                >
                    <StyledBox
                        sx={{
                            position: 'absolute',
                            top: -drawerBleeding,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            visibility: 'visible',
                            right: 0,
                            left: 0,
                        }}
                    >
                        <Puller />
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Logs</Typography>
                    </StyledBox>



                    <StyledBox
                        sx={{
                            px: 2,
                            pb: 2,
                            height: '100%',
                            overflow: 'auto',
                        }}
                    >
                        <div>
                            {logs.map((log, index) => (
                                <p
                                    key={index}
                                    className={`typewriter 
                                    ${logsWithSuccess[index] ? 'greenText' : ''} 
                                    ${log.includes('Failed') ? 'redText' : ''} 
                                    ${log.includes('Received') ? 'purpleText' : ''} 
                                    ${log.includes('Disconnected') ? 'orangeText' : ''}
                                    ${log.includes('.png') || log.includes('.jpg') 
                                    || log.includes('.pdf') || log.includes('.xlsx')
                                    || log.includes('.docx') || log.includes('.doc')
                                    ? 'blueText' : ''}
                                    
                                    `}
                                >
                                    {log}
                                </p>
                            ))}
                        </div>
                    </StyledBox>





                </SwipeableDrawer>
            </Container>
        </Root>
    );
}

SwipeableEdgeDrawer.propTypes = {
    window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
