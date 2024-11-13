import React, { useEffect, useState } from 'react';
import api from "../../api";

export const defaultMenuItems = [
    { title: "Contacts and Organization", path: "/contacts" },
    { title: "Vacation", path: "/vacation" },
    { title: "Home office", path: "/home_office" },
    { title: "My requests", path: "/my_requests" }
];