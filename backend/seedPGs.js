import mongoose from "mongoose";
import PGHostel from "./src/models/PGHostel.js";

const MONGO_URI = "mongodb+srv://easehub:HuxhX0HaI535XyqF@cluster0.f6xugmd.mongodb.net/easehub?retryWrites=true&w=majority";

const pgData = [
    // BOYS PGs (15)
    {
        name: "Green Valley Boys PG",
        description: "Modern boys hostel with WiFi, AC rooms, and 24/7 security. Close to colleges and metro.",
        rent: 8500,
        gender: "male",
        contactNumber: "+91 98765 43210",
        amenities: ["WiFi", "AC", "Laundry", "Gym", "Security", "Parking"],
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        location: {
            address: "123 MG Road, Koramangala",
            city: "Bangalore",
            pincode: "560034"
        }
    },
    {
        name: "Elite Boys Hostel",
        description: "Premium accommodation for boys with attached bathrooms and modern amenities.",
        rent: 12000,
        gender: "male",
        contactNumber: "+91 98765 43211",
        amenities: ["WiFi", "AC", "Attached Bathroom", "Meals", "Housekeeping"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"],
        location: {
            address: "45 Indiranagar Main Road",
            city: "Bangalore",
            pincode: "560038"
        }
    },
    {
        name: "Tech Hub Boys PG",
        description: "Perfect for IT professionals and students. Near tech parks.",
        rent: 9500,
        gender: "male",
        contactNumber: "+91 98765 43212",
        amenities: ["WiFi", "Power Backup", "Parking", "Security", "Common Area"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: {
            address: "78 Whitefield Road",
            city: "Bangalore",
            pincode: "560066"
        }
    },
    {
        name: "Comfort Boys Residence",
        description: "Affordable and comfortable stay for boys with all basic amenities.",
        rent: 7000,
        gender: "male",
        contactNumber: "+91 98765 43213",
        amenities: ["WiFi", "Laundry", "Security", "Common Kitchen"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"],
        location: {
            address: "12 BTM Layout",
            city: "Bangalore",
            pincode: "560076"
        }
    },
    {
        name: "Royal Boys PG",
        description: "Luxury boys hostel with premium facilities and services.",
        rent: 15000,
        gender: "male",
        contactNumber: "+91 98765 43214",
        amenities: ["WiFi", "AC", "Gym", "Swimming Pool", "Meals", "Housekeeping"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        location: {
            address: "56 Jayanagar 4th Block",
            city: "Bangalore",
            pincode: "560041"
        }
    },
    {
        name: "Smart Boys Hostel",
        description: "Modern boys PG with smart facilities and great connectivity.",
        rent: 8000,
        gender: "male",
        contactNumber: "+91 98765 43215",
        amenities: ["WiFi", "Security", "Parking", "Laundry", "Common Area"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        location: {
            address: "89 Electronic City Phase 1",
            city: "Bangalore",
            pincode: "560100"
        }
    },
    {
        name: "Campus Boys PG",
        description: "Close to major colleges and universities. Student-friendly environment.",
        rent: 6500,
        gender: "male",
        contactNumber: "+91 98765 43216",
        amenities: ["WiFi", "Security", "Study Room", "Common Kitchen"],
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
        location: {
            address: "34 Malleshwaram",
            city: "Bangalore",
            pincode: "560003"
        }
    },
    {
        name: "Metro Boys Residence",
        description: "Near metro station. Easy access to all parts of the city.",
        rent: 9000,
        gender: "male",
        contactNumber: "+91 98765 43217",
        amenities: ["WiFi", "AC", "Security", "Parking", "Laundry"],
        images: ["https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800"],
        location: {
            address: "67 Marathahalli",
            city: "Bangalore",
            pincode: "560037"
        }
    },
    {
        name: "Budget Boys PG",
        description: "Affordable accommodation for boys with essential amenities.",
        rent: 5500,
        gender: "male",
        contactNumber: "+91 98765 43218",
        amenities: ["WiFi", "Security", "Common Kitchen", "Laundry"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        location: {
            address: "23 Yelahanka",
            city: "Bangalore",
            pincode: "560064"
        }
    },
    {
        name: "Premium Boys Hostel",
        description: "High-end boys hostel with luxury amenities and services.",
        rent: 18000,
        gender: "male",
        contactNumber: "+91 98765 43219",
        amenities: ["WiFi", "AC", "Gym", "Swimming Pool", "Meals", "Housekeeping", "Spa"],
        images: ["https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800"],
        location: {
            address: "90 HSR Layout",
            city: "Bangalore",
            pincode: "560102"
        }
    },
    {
        name: "City Center Boys PG",
        description: "Located in the heart of the city. Perfect for working professionals.",
        rent: 11000,
        gender: "male",
        contactNumber: "+91 98765 43220",
        amenities: ["WiFi", "AC", "Security", "Parking", "Meals"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
        location: {
            address: "45 MG Road",
            city: "Bangalore",
            pincode: "560001"
        }
    },
    {
        name: "Garden View Boys PG",
        description: "Peaceful boys PG with garden view and fresh air.",
        rent: 7500,
        gender: "male",
        contactNumber: "+91 98765 43221",
        amenities: ["WiFi", "Security", "Garden", "Parking", "Laundry"],
        images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"],
        location: {
            address: "12 Banashankari",
            city: "Bangalore",
            pincode: "560070"
        }
    },
    {
        name: "Modern Boys Residence",
        description: "Contemporary boys hostel with modern facilities.",
        rent: 10000,
        gender: "male",
        contactNumber: "+91 98765 43222",
        amenities: ["WiFi", "AC", "Gym", "Security", "Parking", "Common Area"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
        location: {
            address: "78 Rajajinagar",
            city: "Bangalore",
            pincode: "560010"
        }
    },
    {
        name: "Sunrise Boys PG",
        description: "Bright and airy boys PG with excellent ventilation.",
        rent: 6800,
        gender: "male",
        contactNumber: "+91 98765 43223",
        amenities: ["WiFi", "Security", "Laundry", "Common Kitchen"],
        images: ["https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800"],
        location: {
            address: "56 Hebbal",
            city: "Bangalore",
            pincode: "560024"
        }
    },
    {
        name: "Skyline Boys Hostel",
        description: "High-rise boys hostel with city views and modern amenities.",
        rent: 13000,
        gender: "male",
        contactNumber: "+91 98765 43224",
        amenities: ["WiFi", "AC", "Gym", "Security", "Parking", "Rooftop"],
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
        location: {
            address: "34 Bellandur",
            city: "Bangalore",
            pincode: "560103"
        }
    },

    // GIRLS PGs (15)
    {
        name: "Blossom Girls PG",
        description: "Safe and secure girls hostel with 24/7 security and CCTV.",
        rent: 9000,
        gender: "female",
        contactNumber: "+91 98765 43225",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Laundry", "Meals"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"],
        location: {
            address: "23 Koramangala 5th Block",
            city: "Bangalore",
            pincode: "560095"
        }
    },
    {
        name: "Rose Garden Girls Hostel",
        description: "Beautiful girls PG with garden and peaceful environment.",
        rent: 8500,
        gender: "female",
        contactNumber: "+91 98765 43226",
        amenities: ["WiFi", "Security", "CCTV", "Garden", "Laundry", "Common Area"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: {
            address: "67 Indiranagar 2nd Stage",
            city: "Bangalore",
            pincode: "560038"
        }
    },
    {
        name: "Orchid Girls PG",
        description: "Premium girls hostel with luxury amenities and services.",
        rent: 14000,
        gender: "female",
        contactNumber: "+91 98765 43227",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Meals", "Housekeeping"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"],
        location: {
            address: "89 Whitefield Main Road",
            city: "Bangalore",
            pincode: "560066"
        }
    },
    {
        name: "Lily Girls Residence",
        description: "Comfortable and affordable girls PG with all basic amenities.",
        rent: 7000,
        gender: "female",
        contactNumber: "+91 98765 43228",
        amenities: ["WiFi", "Security", "CCTV", "Laundry", "Common Kitchen"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        location: {
            address: "45 BTM Layout 2nd Stage",
            city: "Bangalore",
            pincode: "560076"
        }
    },
    {
        name: "Jasmine Girls PG",
        description: "Homely environment for girls with caring staff.",
        rent: 7500,
        gender: "female",
        contactNumber: "+91 98765 43229",
        amenities: ["WiFi", "Security", "CCTV", "Meals", "Laundry"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        location: {
            address: "12 Jayanagar 7th Block",
            city: "Bangalore",
            pincode: "560082"
        }
    },
    {
        name: "Tulip Girls Hostel",
        description: "Modern girls hostel with smart facilities.",
        rent: 10000,
        gender: "female",
        contactNumber: "+91 98765 43230",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Parking"],
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
        location: {
            address: "78 Electronic City Phase 2",
            city: "Bangalore",
            pincode: "560100"
        }
    },
    {
        name: "Daisy Girls PG",
        description: "Budget-friendly girls PG near colleges.",
        rent: 6000,
        gender: "female",
        contactNumber: "+91 98765 43231",
        amenities: ["WiFi", "Security", "CCTV", "Laundry", "Study Room"],
        images: ["https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800"],
        location: {
            address: "34 Malleshwaram 18th Cross",
            city: "Bangalore",
            pincode: "560055"
        }
    },
    {
        name: "Sunflower Girls Residence",
        description: "Bright and cheerful girls PG with excellent facilities.",
        rent: 8800,
        gender: "female",
        contactNumber: "+91 98765 43232",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Laundry", "Meals"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        location: {
            address: "56 Marathahalli Bridge",
            city: "Bangalore",
            pincode: "560037"
        }
    },
    {
        name: "Lavender Girls PG",
        description: "Peaceful girls hostel with homely atmosphere.",
        rent: 7200,
        gender: "female",
        contactNumber: "+91 98765 43233",
        amenities: ["WiFi", "Security", "CCTV", "Common Kitchen", "Laundry"],
        images: ["https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800"],
        location: {
            address: "23 Yelahanka New Town",
            city: "Bangalore",
            pincode: "560064"
        }
    },
    {
        name: "Magnolia Girls Hostel",
        description: "Luxury girls hostel with premium services.",
        rent: 16000,
        gender: "female",
        contactNumber: "+91 98765 43234",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Swimming Pool", "Spa", "Meals"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
        location: {
            address: "90 HSR Layout Sector 1",
            city: "Bangalore",
            pincode: "560102"
        }
    },
    {
        name: "Violet Girls PG",
        description: "Safe and secure girls PG in prime location.",
        rent: 9500,
        gender: "female",
        contactNumber: "+91 98765 43235",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Parking", "Meals"],
        images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"],
        location: {
            address: "45 MG Road Central",
            city: "Bangalore",
            pincode: "560001"
        }
    },
    {
        name: "Marigold Girls Residence",
        description: "Comfortable girls PG with garden view.",
        rent: 7800,
        gender: "female",
        contactNumber: "+91 98765 43236",
        amenities: ["WiFi", "Security", "CCTV", "Garden", "Laundry"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
        location: {
            address: "12 Banashankari 3rd Stage",
            city: "Bangalore",
            pincode: "560085"
        }
    },
    {
        name: "Peony Girls PG",
        description: "Modern girls hostel with contemporary design.",
        rent: 11000,
        gender: "female",
        contactNumber: "+91 98765 43237",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Common Area"],
        images: ["https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800"],
        location: {
            address: "78 Rajajinagar 2nd Block",
            city: "Bangalore",
            pincode: "560010"
        }
    },
    {
        name: "Iris Girls Hostel",
        description: "Elegant girls PG with excellent amenities.",
        rent: 8200,
        gender: "female",
        contactNumber: "+91 98765 43238",
        amenities: ["WiFi", "Security", "CCTV", "Laundry", "Meals"],
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
        location: {
            address: "56 Hebbal Kempapura",
            city: "Bangalore",
            pincode: "560024"
        }
    },
    {
        name: "Primrose Girls PG",
        description: "Premium girls hostel with city views.",
        rent: 12500,
        gender: "female",
        contactNumber: "+91 98765 43239",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Rooftop", "Parking"],
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        location: {
            address: "34 Bellandur Gate",
            city: "Bangalore",
            pincode: "560103"
        }
    },

    // CO-LIVING / UNISEX (10)
    {
        name: "Unity Co-Living Space",
        description: "Modern co-living space for professionals with separate wings.",
        rent: 10500,
        gender: "unisex",
        contactNumber: "+91 98765 43240",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Common Area", "Parking"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"],
        location: {
            address: "45 Koramangala 6th Block",
            city: "Bangalore",
            pincode: "560095"
        }
    },
    {
        name: "Harmony Residences",
        description: "Premium co-living with luxury amenities for all.",
        rent: 15000,
        gender: "unisex",
        contactNumber: "+91 98765 43241",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Swimming Pool", "Meals", "Housekeeping"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: {
            address: "67 Indiranagar 1st Stage",
            city: "Bangalore",
            pincode: "560038"
        }
    },
    {
        name: "Fusion Co-Living",
        description: "Affordable co-living space near tech parks.",
        rent: 8500,
        gender: "unisex",
        contactNumber: "+91 98765 43242",
        amenities: ["WiFi", "Security", "CCTV", "Parking", "Laundry", "Common Kitchen"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"],
        location: {
            address: "89 Whitefield ITPL Main Road",
            city: "Bangalore",
            pincode: "560066"
        }
    },
    {
        name: "Nexus Living",
        description: "Smart co-living with modern facilities.",
        rent: 11000,
        gender: "unisex",
        contactNumber: "+91 98765 43243",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Common Area", "Rooftop"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        location: {
            address: "12 HSR Layout Sector 2",
            city: "Bangalore",
            pincode: "560102"
        }
    },
    {
        name: "Synergy Co-Living",
        description: "Vibrant co-living community for young professionals.",
        rent: 9500,
        gender: "unisex",
        contactNumber: "+91 98765 43244",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Events Space", "Parking"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        location: {
            address: "78 Electronic City Phase 1",
            city: "Bangalore",
            pincode: "560100"
        }
    },
    {
        name: "Zenith Residences",
        description: "Luxury co-living with premium services.",
        rent: 18000,
        gender: "unisex",
        contactNumber: "+91 98765 43245",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Swimming Pool", "Spa", "Meals", "Housekeeping"],
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
        location: {
            address: "34 MG Road Premium",
            city: "Bangalore",
            pincode: "560001"
        }
    },
    {
        name: "Pulse Co-Living",
        description: "Energetic co-living space near metro.",
        rent: 8000,
        gender: "unisex",
        contactNumber: "+91 98765 43246",
        amenities: ["WiFi", "Security", "CCTV", "Parking", "Laundry", "Common Area"],
        images: ["https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800"],
        location: {
            address: "56 Marathahalli Metro",
            city: "Bangalore",
            pincode: "560037"
        }
    },
    {
        name: "Vibe Living",
        description: "Trendy co-living with modern design.",
        rent: 10000,
        gender: "unisex",
        contactNumber: "+91 98765 43247",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Rooftop", "Common Area"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        location: {
            address: "23 Jayanagar 4th Block",
            city: "Bangalore",
            pincode: "560041"
        }
    },
    {
        name: "Connect Co-Living",
        description: "Community-focused co-living space.",
        rent: 9000,
        gender: "unisex",
        contactNumber: "+91 98765 43248",
        amenities: ["WiFi", "Security", "CCTV", "Common Kitchen", "Events Space", "Laundry"],
        images: ["https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800"],
        location: {
            address: "45 Banashankari 2nd Stage",
            city: "Bangalore",
            pincode: "560070"
        }
    },
    {
        name: "Elevate Residences",
        description: "High-end co-living with city views.",
        rent: 13500,
        gender: "unisex",
        contactNumber: "+91 98765 43249",
        amenities: ["WiFi", "AC", "Security", "CCTV", "Gym", "Swimming Pool", "Rooftop", "Parking"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
        location: {
            address: "67 Bellandur ORR",
            city: "Bangalore",
            pincode: "560103"
        }
    }
];

const seedPGs = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        await PGHostel.deleteMany({});
        console.log("🗑️  Cleared existing PG data");

        const inserted = await PGHostel.insertMany(pgData);
        console.log(`✅ Inserted ${inserted.length} PG/Hostels`);

        const counts = await PGHostel.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);
        console.log("📊 Distribution:");
        counts.forEach(c => console.log(`   ${c._id}: ${c.count}`));

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed Error:", error.message);
        process.exit(1);
    }
};

seedPGs();
