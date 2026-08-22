import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { editUserDetails } from '../../services/auth';

const EditUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to extract user from navigation state
  const stateUser = location.state?.editUser;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER'>('USER');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (stateUser) {
      setFormData({
        name: stateUser.name || '',
        email: stateUser.email || '',
        password: '' // Keep password empty
      });
      const roles = stateUser.roles || [];
      setSelectedRole(roles.includes('ADMIN') ? 'ADMIN' : 'USER');
      setImagePreview(stateUser.profileImg || stateUser.profileimg || null);
    } else {
      toast.error('User data not found. Returning to list.');
      navigate('/admin/all-users');
    }
  }, [stateUser, navigate]);

  // --- HELPER: FORM VALIDATION ---
  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!name || !email) {
      toast.error('Name and Email are required');
      return false;
    }

    if (name.length < 3) {
      toast.error('Name must be at least 3 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Password is optional during edit
    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (imageFile) {
      if (imageFile.size > 2 * 1024 * 1024) {
        toast.error('Profile picture must be smaller than 2MB');
        return false;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        toast.error('Only JPG, PNG, and WebP images are allowed');
        return false;
      }
    }

    return true;
  };

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) return;

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      formDataToSend.append('roles', JSON.stringify([selectedRole]));

      if (imageFile) {
        formDataToSend.append('profileimg', imageFile);
      }

      const response = await editUserDetails(userId, formDataToSend);
      
      toast.success(response.message || 'User updated successfully!');
      setTimeout(() => navigate('/admin/all-users'), 1500);
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex flex-col gap-10 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8'>
      <Header title="Edit User Details" description="Modify administrator or traveler account details" />
      
      <section className="mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <form className="flex flex-col gap-6 py-8 bg-white rounded-2xl shadow-xl border border-gray-50" onSubmit={handleSubmit}>

          {/* Profile Picture Upload */}
          <div className="w-full flex flex-col gap-4 px-6 items-center">
            <label className="text-sm font-bold text-gray-500 self-start">Profile Picture</label>
            <div 
              className="relative w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 cursor-pointer hover:border-blue-400 transition-all group shadow-inner"
              onClick={() => document.getElementById('profilePicture')?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:text-blue-500">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              )}
            </div>
            <input id="profilePicture" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 px-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <input 
                className="w-full px-4 py-3 border-2 rounded-xl border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium"
                type="text" name="name" value={formData.name} onChange={handleInputChange} required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input 
                className="w-full px-4 py-3 border-2 rounded-xl border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium"
                type="email" name="email" value={formData.email} onChange={handleInputChange} required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password (Leave blank to keep current)</label>
              <input 
                className="w-full px-4 py-3 border-2 rounded-xl border-gray-100 focus:border-blue-500 focus:outline-none transition-all font-medium"
                type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} 
              />
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assign Role</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('USER')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${selectedRole === 'USER' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
                >
                  <span className={`block font-bold ${selectedRole === 'USER' ? 'text-blue-500' : 'text-gray-700'}`}>User</span>
                  <span className="text-[10px] text-gray-400">Regular access for travelers</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${selectedRole === 'ADMIN' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
                >
                  <span className={`block font-bold ${selectedRole === 'ADMIN' ? 'text-blue-500' : 'text-gray-700'}`}>Admin</span>
                  <span className="text-[10px] text-gray-400">Full management control</span>
                </button>
              </div>
            </div>
          </div>

          <footer className="px-6 mt-4 flex gap-4">
            <Button
              type="submit"
              ctaText={loading ? "Processing..." : "Save Changes"}
              variant="primary"
              fullWidth={true}
              disabled={loading}
            />
            <Button
              type="button"
              ctaText="Cancel"
              variant="secondary"
              fullWidth={false}
              className="px-8"
              onClick={() => navigate('/admin/all-users')}
              disabled={loading}
            />
          </footer>
        </form>
      </section>
    </main>
  );
};

export default EditUser;
