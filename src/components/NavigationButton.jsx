import { Button } from '@material-ui/core';
import React from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../jotai/models';

function NavigationButton({
  onClick, icon, children, noAuth = true, secondary = false,
}) {
  const [currentUser] = useAtom(currentUserAtom);

  const shouldRenderButton = noAuth || (currentUser?.role === 'admin');

  if (!shouldRenderButton) return null;

  return (
    <Button
      sx={{ margin: '20px' }}
      variant="contained"
      color={secondary ? 'secondary' : 'primary'}
      startIcon={icon || null}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default NavigationButton;
