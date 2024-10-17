import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Outlet style={{ overflow: 'auto' }} />
        </>
    );
};

export default Layout;
