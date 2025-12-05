const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./src/models/Recipe');
const User = require('./src/models/User');

dotenv.config();

// DATOS REALES DE TUS ARCHIVOS HTML
const recetasReales = [
    {
        titulo: "Tacos al Pastor",
        descripcion: "Deliciosos tacos mexicanos con carne de cerdo marinada en especias tradicionales, acompañados de piña asada.",
        categoria: "mexicana",
        tiempoPrep: 30,
        tiempoCoccion: 45,
        imageUrl: "https://milrecetas.net/wp-content/uploads/2016/09/Tacos-al-pastor-2.jpg",
        ingredientes: [
            { nombre: "Carne de cerdo (lomo)", cantidad: "1", unidad: "kg" },
            { nombre: "Chile guajillo en polvo", cantidad: "3", unidad: "cdas" },
            { nombre: "Achiote en pasta", cantidad: "2", unidad: "cdas" },
            { nombre: "Jugo de naranja", cantidad: "0.5", unidad: "taza" },
            { nombre: "Tortillas de maíz", cantidad: "12", unidad: "piezas" },
            { nombre: "Piña fresca", cantidad: "1", unidad: "pieza" }
        ],
        pasos: [
            "Preparar la marinada: Mezcla chile, achiote, ajo y jugo en la licuadora.",
            "Marinar la carne: Corta la carne en tiras y cúbrela con la marinada por 4 horas.",
            "Cocinar: Fríe la carne en un sartén muy caliente hasta que dore.",
            "Asar la piña: Asa rebanadas de piña y córtalas en cubos.",
            "Armar: Sirve en tortillas calientes con cebolla, cilantro y piña."
        ]
    },
    {
        titulo: "Pozole Rojo",
        descripcion: "Platillo tradicional mexicano. Caldo sustancioso de chiles secos con carne de cerdo y maíz cacahuazintle.",
        categoria: "mexicana",
        tiempoPrep: 45,
        tiempoCoccion: 150,
        imageUrl: "https://th.bing.com/th/id/R.c7e20f6c86d2ea895517ae6c58849296?rik=idBTVaVignz0jQ&riu=http%3a%2f%2fcdn.kiwilimon.com%2frecetaimagen%2f3926%2f2453.jpg&ehk=pqHjD3MEP%2fSOONegG%2fp9hbUgCCuwDMb%2fbPoEIVXN6Vg%3d&risl=&pid=ImgRaw&r=0",
        ingredientes: [
            { nombre: "Maíz cacahuazintle", cantidad: "1", unidad: "kg" },
            { nombre: "Carne de cerdo", cantidad: "1", unidad: "kg" },
            { nombre: "Chiles guajillo", cantidad: "10", unidad: "piezas" },
            { nombre: "Lechuga romana", cantidad: "0.5", unidad: "pieza" },
            { nombre: "Rábanos", cantidad: "1", unidad: "manojo" },
            { nombre: "Orégano seco", cantidad: "1", unidad: "cda" }
        ],
        pasos: [
            "Cocer la carne y el maíz con ajo y cebolla por 1.5 horas.",
            "Preparar la salsa roja licuando los chiles hervidos.",
            "Integrar la salsa colada a la olla del maíz.",
            "Hervir a fuego bajo por 30 minutos más.",
            "Servir con lechuga, rábano, limón y tostadas."
        ]
    },
    {
        titulo: "Pasta Carbonara",
        descripcion: "Clásica pasta italiana con guanciale, yemas de huevo, queso Pecorino Romano y pimienta negra.",
        categoria: "pasta",
        tiempoPrep: 10,
        tiempoCoccion: 15,
        imageUrl: "https://img.taste.com.au/86bOXAkG/taste/2016/11/carbonara-sauce-28894-1.jpeg",
        ingredientes: [
            { nombre: "Espagueti", cantidad: "400", unidad: "g" },
            { nombre: "Guanciale o Panceta", cantidad: "150", unidad: "g" },
            { nombre: "Yemas de huevo", cantidad: "4", unidad: "piezas" },
            { nombre: "Queso Pecorino", cantidad: "100", unidad: "g" },
            { nombre: "Pimienta negra", cantidad: "1", unidad: "cdita" }
        ],
        pasos: [
            "Batir yemas con queso y mucha pimienta para la salsa.",
            "Freír el guanciale en cubos hasta que esté crujiente.",
            "Cocer la pasta al dente y reservar agua de cocción.",
            "Mezclar la pasta con el guanciale FUERA del fuego.",
            "Agregar la mezcla de huevo y un poco de agua de cocción para crear la crema."
        ]
    },
    {
        titulo: "Pancakes Americanos",
        descripcion: "Pancakes esponjosos y suaves, perfectos para un desayuno de fin de semana con miel de maple.",
        categoria: "desayuno",
        tiempoPrep: 10,
        tiempoCoccion: 15,
        imageUrl: "https://osojimix.com/wp-content/uploads/2021/07/PANCAKES-AMERICANOS.jpg",
        ingredientes: [
            { nombre: "Harina de trigo", cantidad: "1.5", unidad: "tazas" },
            { nombre: "Leche", cantidad: "1.25", unidad: "tazas" },
            { nombre: "Huevo", cantidad: "1", unidad: "pieza" },
            { nombre: "Mantequilla derretida", cantidad: "3", unidad: "cdas" },
            { nombre: "Polvo de hornear", cantidad: "1.5", unidad: "cdtas" }
        ],
        pasos: [
            "Mezclar ingredientes secos en un bol.",
            "Mezclar ingredientes húmedos (huevo, leche, mantequilla) en otro bol.",
            "Combinar ambas mezclas sin batir demasiado.",
            "Cocinar en sartén engrasado a fuego medio.",
            "Voltear cuando salgan burbujas y servir."
        ]
    },
    {
        titulo: "Brownies de Chocolate",
        descripcion: "Brownies densos, húmedos y extra chocolatados con una costra crujiente.",
        categoria: "postre",
        tiempoPrep: 15,
        tiempoCoccion: 25,
        imageUrl: "https://bing.com/th?id=OSK.a1de2143a235d2c8216454ea9e40aff5",
        ingredientes: [
            { nombre: "Chocolate semiamargo", cantidad: "150", unidad: "g" },
            { nombre: "Mantequilla", cantidad: "115", unidad: "g" },
            { nombre: "Azúcar", cantidad: "1", unidad: "taza" },
            { nombre: "Huevos", cantidad: "2", unidad: "piezas" },
            { nombre: "Cocoa en polvo", cantidad: "0.25", unidad: "taza" },
            { nombre: "Harina", cantidad: "0.75", unidad: "taza" }
        ],
        pasos: [
            "Derretir chocolate con mantequilla.",
            "Añadir azúcar y huevos batiendo bien.",
            "Incorporar ingredientes secos con espátula.",
            "Hornear a 180°C por 20-25 minutos en molde preparado."
        ]
    },
    {
        titulo: "Ensalada César",
        descripcion: "Fresca ensalada con lechuga romana, crutones al ajo, parmesano y aderezo cremoso.",
        categoria: "entrada",
        tiempoPrep: 20,
        tiempoCoccion: 5,
        imageUrl: "https://tse4.mm.bing.net/th/id/OIP.nx0eOhIu-1XgUmruKja3RgHaGI?rs=1&pid=ImgDetMain&o=7&rm=3",
        ingredientes: [
            { nombre: "Lechuga romana", cantidad: "1", unidad: "pieza" },
            { nombre: "Crutones", cantidad: "1", unidad: "taza" },
            { nombre: "Queso Parmesano", cantidad: "0.5", unidad: "taza" },
            { nombre: "Anchoas", cantidad: "2", unidad: "filetes" },
            { nombre: "Yema de huevo", cantidad: "1", unidad: "pieza" },
            { nombre: "Aceite de oliva", cantidad: "0.5", unidad: "taza" }
        ],
        pasos: [
            "Preparar aderezo licuando yema, anchoas, ajo, limón y aceite.",
            "Lavar y trocear la lechuga.",
            "Mezclar lechuga con aderezo en un bol grande.",
            "Agregar crutones y queso parmesano al final.",
            "Servir inmediatamente."
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🌱 Conectado a MongoDB...");

        // 1. Buscar o Crear un Usuario Admin para que sea el "Dueño" de estas recetas
        let adminUser = await User.findOne({ email: "admin@recetastico.com" });
        
        if (!adminUser) {
            console.log("👤 Creando usuario Admin temporal...");
            // Nota: En un seed real deberías encriptar el password, 
            // pero para prueba rápida esto funciona si tu modelo tiene el pre-save hook.
            adminUser = new User({
                nombre: "Admin Chef",
                email: "admin@recetastico.com",
                password: "admin12345", 
                role: "admin"
            });
            await adminUser.save();
        }

        // 2. Limpiar recetas viejas (Opcional, descomenta si quieres borrar todo antes de cargar)
        // await Recipe.deleteMany({});
        // console.log("🧹 Recetas viejas eliminadas...");

        // 3. Asignar el ID del admin a las recetas
        const recetasConAutor = recetasReales.map(receta => ({
            ...receta,
            autor: adminUser._id
        }));

        // 4. Insertar en la BD
        await Recipe.insertMany(recetasConAutor);
        console.log("✅ ¡6 Recetas importadas exitosamente!");
        console.log("🌮 Tacos, 🥘 Pozole, 🍝 Carbonara, 🥞 Pancakes, 🍫 Brownies, 🥗 Ensalada");

        process.exit();
    } catch (error) {
        console.error("❌ Error en el seed:", error);
        process.exit(1);
    }
};

seedDB();