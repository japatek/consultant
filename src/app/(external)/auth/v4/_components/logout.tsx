"use client"
import React, { useState } from 'react';
import Modal from './child/Modal';
import { LogOutIcon } from 'lucide-react';

import { signOut } from 'next-auth/react';

export default function LogOut() {
  const logout = async () => {
           try {
             await signOut({redirectTo:'/auth/v4/login'});
           } catch (err) {
             console.error("Logout error:", err);
           }
         };
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    logout();
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <a 
        onClick={handleLogoutClick} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '10px 12px', 
          borderRadius: '10px', 
          fontSize: '13px', 
          color: 'var(--red)', 
          cursor: 'pointer', 
          textDecoration: 'none', 
          transition: 'all .15s' 
        }}
      >
        <LogOutIcon/>
      </a>
      
      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        message="Exit from JaPa?"
      />
    </>
  );
}