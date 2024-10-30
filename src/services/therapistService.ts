import axios from 'axios';

export interface TherapistData {
    therapist_id?: string;
    therapist_name: string;
    therapist_email: string;
    therapist_password: string;
}

export const createTherapist = async (therapist: TherapistData) => {
    const response = await axios.post('/api/createTherapist', therapist);
    return response.data;
}; 