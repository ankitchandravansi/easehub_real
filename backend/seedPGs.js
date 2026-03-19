import mongoose from "mongoose";
import PGHostel from "./src/models/PGHostel.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://easehub:HuxhX0HaI535XyqF@cluster0.f6xugmd.mongodb.net/easehub?retryWrites=true&w=majority";

const pgData = [
    {
        name: "Mourya PG (Room Available)",
        description: "Comfortable PG accommodation near Rungta College.",
        rent: 2200,
        gender: "male",
        amenities: ["WiFi", "Parking", "Water Supply"],
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        location: {
            address: "Kurud Rd, in front of Puri It, near Rungta College, Chandra Nagar, Kohka",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "SAFFRON PG",
        description: "Sharing rooms available at affordable rates.",
        rent: 2500,
        gender: "male",
        amenities: ["WiFi", "Water Supply", "Security"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"],
        location: {
            address: "Kurud Rd, near UJJWAL MANGAL BHAWAN, Kohka",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "PRAKASH PG & MESS",
        description: "PG with mess facility included.",
        rent: 3000,
        gender: "male",
        amenities: ["Mess", "Water Supply"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: {
            address: "Avanti bai chowk kurud, Street 3",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "Shrishti Niwas - Boys PG",
        description: "Boys PG near Rungta College.",
        rent: 2600,
        gender: "male",
        amenities: ["WiFi", "Parking"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"],
        location: {
            address: "1st floor, Rudraksh residency, Near Rungta college, Kurud Rd",
            city: "Bhilai",
            pincode: "490024"
        }
    },
    {
        name: "Sai Boy's Hostel",
        description: "Boys hostel in Shivaji Nagar.",
        rent: 2400,
        gender: "male",
        amenities: ["WiFi", "Security"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        location: {
            address: "65JW+2M2, sivaji Nagar, Bhilai, Kurud Rd",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "Sanskar Hostel",
        description: "Hostel accommodation near P.T.M.M School.",
        rent: 2700,
        gender: "unisex",
        amenities: ["WiFi", "Water Supply"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        location: {
            address: "Kurud Road Kohka, Near Ujjwal Mangal Bhawan, behind P.T.M.M.M School, WARD-7, Kohka",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "RAVI HOUSE : PG FOR STUDENT / BACHELOR SERVICE MAN",
        description: "PG for students and working bachelors.",
        rent: 3000,
        gender: "male",
        amenities: ["WiFi", "Parking"],
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
        location: {
            address: "Priyadarshani Parisar West",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Matruchhaya Hostel",
        description: "Hostel at Kurud Road.",
        rent: 2500,
        gender: "unisex",
        amenities: ["Water Supply"],
        images: ["https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800"],
        location: {
            address: "Kurud Road Between ujjwal mangal bhawan and Madan malviya school, Near avantibai chowk, Ward -7, Kohka",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "Girls pg B462 Smriti nagar Bhilai",
        description: "Girls PG in Smriti Nagar.",
        rent: 3500,
        gender: "female",
        amenities: ["Security", "CCTV", "WiFi"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        location: {
            address: "B-462, Cross Street 23, Smriti Nagar",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Galax Boys Hostel",
        description: "Boys hostel above Gopal Dairy.",
        rent: 2800,
        gender: "male",
        amenities: ["WiFi"],
        images: ["https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800"],
        location: {
            address: "above Gopal Dairy, near Central Bank Of India, Ward 07, Radhika Nagar",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "OM NIRMAL SAI KRIPA BOYS HOSTEL & PG",
        description: "Boys hostel near Ekta Chowk.",
        rent: 3200,
        gender: "male",
        amenities: ["WiFi", "Meals"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
        location: {
            address: "NEAR EKTA CHOWK, INFRONT OF SAI KRIPA CHOWK, KAILASH NAGAR INDUSTRIAL ESTATE",
            city: "Bhilai",
            pincode: "490026"
        }
    },
    {
        name: "Aayushi's - Hostel & PG for Girls",
        description: "Girls hostel in Pragati Nagar.",
        rent: 3000,
        gender: "female",
        amenities: ["Security", "WiFi"],
        images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"],
        location: {
            address: "Plot No 93-94, Street-1A, Pragati Nagar, Ajad Market, Risali",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "Das Residency N Boyz PG",
        description: "Boys PG near Science College ground.",
        rent: 2800,
        gender: "male",
        amenities: ["WiFi", "Parking"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
        location: {
            address: "behind Green bee Residency, beside govt. Science college ground, Deepak Nagar, Malviya Nagar",
            city: "Durg",
            pincode: "491001"
        }
    },
    {
        name: "Pratap Boys PG",
        description: "Boys PG in Nehru Nagar East.",
        rent: 3500,
        gender: "male",
        amenities: ["WiFi", "AC"],
        images: ["https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800"],
        location: {
            address: "STREET-12 plot, no-75/7, Nehru Nagar East, Nehru Nagar",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Maruti hostel",
        description: "Hostel at Smriti Nagar Road.",
        rent: 2600,
        gender: "unisex",
        amenities: ["WiFi"],
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
        location: {
            address: "STREET NO. 22, PLOT NO. 701/B, Raipur Naka - Smriti Nagar Rd",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "FOLK HOSTEL",
        description: "Hostel in Priyadarshini Parisar.",
        rent: 3200,
        gender: "unisex",
        amenities: ["WiFi", "Meals"],
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        location: {
            address: "7, 11, Nehru Nagar Main Rd, Priyadarshani Parisar West",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "The Pavilion Hostel",
        description: "Hostel in Kohka.",
        rent: 2900,
        gender: "unisex",
        amenities: ["WiFi", "Parking"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"],
        location: {
            address: "69P2+38F, Kohka",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "Qureshi PG",
        description: "PG in Smriti Nagar.",
        rent: 2800,
        gender: "unisex",
        amenities: ["Water Supply"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: {
            address: "688C+GHJ, Smriti Nagar",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Maa karma niwas",
        description: "PG near new govt high school.",
        rent: 2500,
        gender: "unisex",
        amenities: ["Water Supply"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"],
        location: {
            address: "Near by new govt. high secondary school, Kurud",
            city: "Bhilai",
            pincode: "490026"
        }
    },
    {
        name: "BHARDWAJ HOSTEL- CLASSES - FOOD POINT",
        description: "Hostel with food point.",
        rent: 3500,
        gender: "unisex",
        amenities: ["Food", "Classes"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        location: {
            address: "95/B-9, Nehru Nagar East",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Ved Hostel",
        description: "Hostel in Smriti Nagar.",
        rent: 3000,
        gender: "unisex",
        amenities: ["WiFi"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        location: {
            address: "Smriti Nagar",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Sharma boy's PG",
        description: "Boys PG in Risali.",
        rent: 3200,
        gender: "male",
        amenities: ["WiFi", "Meals"],
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
        location: {
            address: "Cross street, 10, Shakti Vihar Rd, Risali",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "Sawai Girls PG",
        description: "Girls PG in Nehru Nagar West.",
        rent: 3800,
        gender: "female",
        amenities: ["Security", "WiFi"],
        images: ["https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800"],
        location: {
            address: "House 08, Block 23, Street 08, Nehru Nagar West, Vidya Vihar Colony",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Adarsh girls hostel",
        description: "Girls hostel in Nehru Nagar East.",
        rent: 3600,
        gender: "female",
        amenities: ["Security", "Mess"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        location: {
            address: "Street-9, Nehru Nagar East",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Raja Bhaiya PG(paying Guest/hostel)",
        description: "PG and hostel in Sector 10.",
        rent: 3000,
        gender: "male",
        amenities: ["WiFi"],
        images: ["https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800"],
        location: {
            address: "58MJ+HWB, Sector 10",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "RAO PG",
        description: "PG in Shakti Vihar.",
        rent: 2800,
        gender: "unisex",
        amenities: ["Water Supply"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
        location: {
            address: "151/G, Street-6, Shakti Vihar Rd",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "Shivaay P.G for girls",
        description: "Girls PG in Anand Nagar.",
        rent: 3400,
        gender: "female",
        amenities: ["Security", "WiFi"],
        images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"],
        location: {
            address: "Plot 1 302/18 street 3 Anand nagar, in front of shivam boys pg, Smriti Nagar",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "KALYAN PG COLLEGE BHILAI",
        description: "PG College hostel.",
        rent: 2500,
        gender: "unisex",
        amenities: ["Library"],
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
        location: {
            address: "58WM+753, Sector 7",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "Pradeep Rastogi",
        description: "Accommodation in Shanti Nagar.",
        rent: 3000,
        gender: "unisex",
        amenities: ["Water Supply"],
        images: ["https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800"],
        location: {
            address: "68HW+8HP, Shanti Nagar",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "Arham Girls PG HOSTEL",
        description: "Girls hostel near new govt high school.",
        rent: 3200,
        gender: "female",
        amenities: ["Security", "Meals"],
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
        location: {
            address: "Near by new govt. high secondary school, Kurud",
            city: "Bhilai",
            pincode: "490026"
        }
    },
    {
        name: "Agrawal's Girls Pg St-10",
        description: "Girls PG in Smriti Nagar.",
        rent: 3500,
        gender: "female",
        amenities: ["Security", "WiFi"],
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        location: {
            address: "House A11, Street 10, Smriti Nagar",
            city: "Bhilai",
            pincode: "490020"
        }
    },
    {
        name: "Keshri kunj boys pg",
        description: "Boys PG in Priyadarshini Nagar.",
        rent: 3100,
        gender: "male",
        amenities: ["WiFi"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"],
        location: {
            address: "111/2a, Priyadarshini Nagar, Maitri Nagar, Risali",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "Vishwakarma niwas P.G for boys",
        description: "Boys PG in Hari Nagar.",
        rent: 2800,
        gender: "male",
        amenities: ["WiFi"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: {
            address: "48/22, Hari Nagar Main Rd, Asha Nagar, Gandhi Nagar, Katulbod, Durg, Hanuman Nagar",
            city: "Durg",
            pincode: "490023"
        }
    },
    {
        name: "Poonam Girls PG & Tiffin Service at Risali, Bhilai",
        description: "Girls PG with Tiffin Service in Risali.",
        rent: 4000,
        gender: "female",
        amenities: ["Meals", "Home Food", "Security"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"],
        location: {
            address: "Plot No. 16, Daya Nagar, Risali",
            city: "Bhilai",
            pincode: "490006"
        }
    },
    {
        name: "A1 Girls hostel",
        description: "Girls hostel in Shanti Nagar.",
        rent: 3300,
        gender: "female",
        amenities: ["Security", "WiFi"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        location: {
            address: "68GW+8H8, Shanti Nagar",
            city: "Bhilai",
            pincode: "490023"
        }
    },
    {
        name: "Anandi Bhawan",
        description: "Accommodation in Kosa Nagar.",
        rent: 2600,
        gender: "unisex",
        amenities: ["Water Supply"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        location: {
            address: "Kosa Nagar, Dixit Colony",
            city: "Bhilai",
            pincode: "490020"
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
