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
} from "@mui/material";
import { Grid } from "@mui/material";
import {
    Menu as MenuIcon,
    Title as TitleIcon,
    Person as PersonIcon,
    Description as DescriptionIcon,
    Book as BookIcon,
    CalendarToday as CalendarIcon,
    Category as CategoryIcon,
    AttachMoney as PriceIcon,
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

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        isbn: "",
        publicationDate: "",
        genre: "",
        price: "",
        publisher: "",
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

        if (!formData.author.trim()) {
            newErrors.author = "Author is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 50) {
            newErrors.description = "Description must be at least 50 characters";
        }

        if (!formData.isbn.trim()) {
            newErrors.isbn = "ISBN is required";
        } else if (!/^(?:\d{10}|\d{13})$/.test(formData.isbn.replace(/[-\s]/g, ""))) {
            newErrors.isbn = "ISBN must be 10 or 13 digits";
        }

        if (!formData.publicationDate) {
            newErrors.publicationDate = "Publication date is required";
        }

        if (!formData.genre.trim()) {
            newErrors.genre = "Genre is required";
        }

        if (formData.price && isNaN(Number(formData.price))) {
            newErrors.price = "Price must be a valid number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                    author: "",
                    description: "",
                    isbn: "",
                    publicationDate: "",
                    genre: "",
                    price: "",
                    publisher: "",
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
                                        <TextField
                                            fullWidth
                                            label="Author"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            error={!!errors.author}
                                            helperText={errors.author}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            error={!!errors.description}
                                            helperText={errors.description || "Minimum 50 characters"}
                                            required
                                            multiline
                                            rows={4}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                                                        <DescriptionIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="ISBN"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                            error={!!errors.isbn}
                                            helperText={errors.isbn || "10 or 13 digits"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BookIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Genre"
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            error={!!errors.genre}
                                            helperText={errors.genre}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CategoryIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Publication Date"
                                            name="publicationDate"
                                            type="date"
                                            value={formData.publicationDate}
                                            onChange={handleChange}
                                            error={!!errors.publicationDate}
                                            helperText={errors.publicationDate}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            error={!!errors.price}
                                            helperText={errors.price}
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
                                        <TextField
                                            fullWidth
                                            label="Publisher"
                                            name="publisher"
                                            value={formData.publisher}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BookIcon color="action" />
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
                                                        author: "",
                                                        description: "",
                                                        isbn: "",
                                                        publicationDate: "",
                                                        genre: "",
                                                        price: "",
                                                        publisher: "",
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