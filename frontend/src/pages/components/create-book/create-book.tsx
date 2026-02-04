import { useState } from "react";
import {
    Box,
    IconButton,
    Container,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import { Grid } from "@mui/material";
import {
    Menu as MenuIcon,
    Title as TitleIcon,
    AttachMoney as PriceIcon,
    MenuBook as MenuBookIcon,
    Wallpaper as WallpaperIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../home/Sidebar";
import { createBook } from "../../Auth/service";
import "./create-book.css";

function CreateBook() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const coverTypeOptions = [
        { value: "softcover", label: "Softcover" },
        { value: "hardcover", label: "Hardcover" },
        { value: "audiobook", label: "Audiobook" },
        { value: "ebook", label: "Ebook" },
    ];

    const [formData, setFormData] = useState({
        title: "",
        coverType: "",
        coverImage: "",
        price: "49.99",
        coverImagePreview: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState("");

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.coverType.trim()) {
            newErrors.coverType = "Cover type is required";
        }

        if (!formData.coverImage.trim()) {
            newErrors.coverImage = "Cover image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSelectChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: formData.price ? Number(formData.price) : undefined,
            };

            const response = await createBook(payload);
            if (response.data.status === 200) {
                toast.success("Book created successfully!");
                // Reset form
                setFormData({
                    title: "",
                    coverType: "",
                    coverImage: "",
                    coverImagePreview: "",
                    price: "49.99",
                });
                // Optionally navigate to a books list page
                // navigate('/books');
            } else {
                toast.error(response.data.message || "Failed to create book");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (error.response?.data?.message === "Session expired. Please login again.") {
                toast.error(errorMessage);
                localStorage.removeItem("token");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                toast.error(errorMessage || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="book-container">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                isMobile={isMobile}
            />
            {sidebarOpen && <Box className="sidebar-overlay" onClick={closeSidebar} />}
            <Box className="book-main-content">
                <Box className="book-header-mobile">
                    <IconButton
                        className="menu-toggle-button"
                        onClick={toggleSidebar}
                        aria-label="toggle sidebar"
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Box className="book-content-wrapper">
                    <Container maxWidth="lg" className="book-content">
                        <Paper elevation={3} className="book-paper">
                            <Typography variant="h4" component="h1" gutterBottom className="book-welcome">
                                Create New Book
                            </Typography>
                            <Typography variant="body1" className="book-subtitle">
                                Fill in the details below to add a new book to your collection.
                            </Typography>

                            {error && (
                                <Box className="error-message" sx={{ mt: 2, mb: 2 }}>
                                    <Typography color="error">{error}</Typography>
                                </Box>
                            )}

                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TitleIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Autocomplete
                                            options={coverTypeOptions}
                                            getOptionLabel={(option) => option.label}
                                            value={coverTypeOptions.find(c => c.value === formData.coverType) || null}
                                            onChange={(_, newValue) => {
                                                handleSelectChange({
                                                    target: {
                                                        name: "coverType",
                                                        value: newValue?.value || "",
                                                    },
                                                });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label="Cover Type"
                                                    className="auth-input"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <MenuBookIcon className="input-icon" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            )}
                                            sx={{
                                                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            startIcon={<WallpaperIcon />}
                                            sx={{ 
                                                justifyContent: "flex-start", py: 2,
                                                border: '1px solid rgb(238 238 238)',
                                                borderColor: 'rgb(127 132 136 / 50%) !important',
                                                color: 'rgb(126 122 122) !important',
                                            }}
                                        >
                                            {
                                                formData.coverImagePreview 
                                                    ? 
                                                <span style={{ textTransform: 'capitalize' }}>
                                                    Change Cover Image
                                                </span> 
                                                    : 
                                                <span style={{ textTransform: 'capitalize' }}>
                                                    Upload Cover Image
                                                </span>
                                            }
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                name="coverImage"
                                                onChange={(e) => {
                                                    const file = e.target?.files?.[0];
                                                    if (file) {
                                                    setFormData({
                                                        ...formData,
                                                        coverImage: file?.name || "",
                                                        coverImagePreview: URL.createObjectURL(file),
                                                    });
                                                    }
                                                }}
                                                style={{
                                                    border: '1px solid rgb(238 238 238)',
                                                    borderColor: 'rgb(127 132 136 / 50%) !important',
                                                    backgroundColor: 'var(--variant-outline;color: #4a78a6;lor) !important',
                                                    color: '#4a78a6 !important',
                                                }}
                                            />
                                        </Button>

                                        {errors.coverImage && (
                                            <Typography color="error">{errors.coverImage}</Typography>
                                        )}

                                        {formData.coverImagePreview && (
                                            <Box mt={2} 
                                                sx={{ width: '200px',
                                                    border: '2px solid #7eadff',
                                                    borderRadius: '10px',
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <img
                                                    src={formData.coverImagePreview}
                                                    alt="Cover preview"
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: 300,
                                                        objectFit: "cover",
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            error={!!errors.price}
                                            helperText={errors.price}
                                            required
                                            disabled={true}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PriceIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setFormData({
                                                        title: "",
                                                        coverType: "",
                                                        coverImage: "",
                                                        coverImagePreview: "",
                                                        price: "49.99",
                                                    });
                                                    setErrors({});
                                                }}
                                                disabled={loading}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                                    },
                                                }}
                                            >
                                                {loading ? <CircularProgress size={24} /> : "Create Book"}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default CreateBook;