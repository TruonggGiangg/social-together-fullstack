// import { useState, useEffect } from 'react';
// import { userService } from '../services/userService';

// export function useAuth() {
//     const [user, setUser] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         userService.getProfile()
//             .then(setUser)
//             .catch((err) => setError(err.message))
//             .finally(() => setLoading(false));
//     }, []);

//     return { user, loading, error };
// }
