import { Alert } from '@mui/material';
import type { FormAlertProps } from '../../Types/system_types.ts';

function FormAlert({ message }: FormAlertProps) {
    if (!message) {
        return null;
    }

    return (
        <Alert severity="error" role="alert">
            {message}
        </Alert>
    );
}

export default FormAlert;
