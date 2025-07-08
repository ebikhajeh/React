1. npm install sqlite3

2. db/database.js
                    const sqlite3 = require('sqlite3').verbose();
                    const path = require('path');
                    
                    const db = new sqlite3.Database(path.join(__dirname, 'station.db'), (err) => {
                      if (err) {
                        console.error('Database connection error', err.message);
                      } else {
                        console.log('Connected to SQLITE Database');
                      }
                    });
                    
                    module.exports = db;

3. index.js
            const db = require('./db/database');

4. Create tables based on the project: 
   models/initModels.js
                                        const db = require('../db/database');
                                        db.serialize(() => {
                                          db.run(`
                                            CREATE TABLE IF NOT EXISTS cigarettes (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              name TEXT NOT NULL,
                                              brand TEXT
                                            );
                                          `);
                                        
                                          db.run(`
                                            CREATE TABLE IF NOT EXISTS cashiers (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              name TEXT NOT NULL,
                                              shift_type TEXT CHECK(shift_type IN ('morning', 'evening')) NOT NULL
                                            );
                                          `);
                                        
                                          db.run(`
                                            CREATE TABLE IF NOT EXISTS cigarette_counts (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              cigarette_id INTEGER NOT NULL,
                                              date TEXT NOT NULL,
                                              single_count_morning INTEGER,
                                              carton_count_morning INTEGER,
                                              single_count_evening INTEGER,
                                              carton_count_evening INTEGER,
                                              delivery_count INTEGER,
                                              bulloc_sale Integer,
                                              FOREIGN KEY (cigarette_id) REFERENCES cigarettes(id)
                                            );
                                          `);
                                        
                                          db.run(`
                                            CREATE TABLE IF NOT EXISTS current_inventory (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              cigarette_id INTEGER NOT NULL,
                                              single_count INTEGER,
                                              carton_count INTEGER,
                                              last_updated TEXT,
                                              FOREIGN KEY (cigarette_id) REFERENCES cigarettes(id)
                                            );
                                          `);
                                        
                                          db.run(`
                                            CREATE TABLE IF NOT EXISTS monthly_cigarette_plan (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              day_of_month INTEGER NOT NULL,
                                              cigarette_id INTEGER NOT NULL,
                                              FOREIGN KEY (cigarette_id) REFERENCES cigarettes(id)
                                            );
                                          `);
                                          
                                          console.log('Tables successfully created...');
                                        });
                                        -----------------Optional but Recommended Additions---------------
                                          db.run(`CREATE TABLE ...`, (err) => {
                                            if (err) {
                                              console.error('Error creating table:', err.message);
                                            }
                                          });
                                        -------------------------------------------------------------------
5.index.js
          require('./models/initModels');

6.models/seedCashier.js
                        const cashier = [
                          { name: "Ebi", shift_type: "morning" },
                          {name: "Sachin", shift_type: "evening" },
                        ];
                        
                        function seedCashier() {
                          const db = require('../db/database');
                          cashier.forEach(cashier => {
                            db.run(
                              `INSERT INTO cashiers (name, shift_type) VALUES (?, ?)`,
                              [cashier.name, cashier.shift_type],
                              (err) => {
                                if (err) {
                                  console.error(`Error entring data ${cashier.name}:`, err.message);
                                }
                              }
                            );
                          });
                          console.log('✅ Initial list of Cigarettes was entered successfully');
                        }
                        
                        module.exports = seedCashier;


7. index.js
            const cigaretteRoutes = require('./routes/cigaretteRoutes');
            app.use('/cigarettes', cigaretteRoutes);
            
            const cashierRoutes = require('./routes/cashierRoutes');
            app.use('/cashier', cashierRoutes);


8. routes/cigaretteRoutes
                          const express = require('express');
                          const router = express.Router();
                          const controller = require('../controllers/cigaretteController');
                          
                          router.get('/', (req, res)=> {
                              res.send('We are in Cigatette route');
                          });
                          
                          router.get('/today', controller.getTodayCigarettes);
                          
                          module.exports = router;


9. controllers/cigaretteController
                                  const cigaretteService = require("../services/cigaretteService");
                                  
                                  const getTodayCigarettes = async (req, res) => {
                                    try {
                                      const result = await cigaretteService.getCigarettesForToday();
                                      return res.status(200).json(result);
                                    } catch (error) {
                                      console.error("getTodayCigarettes error:", error);
                                      return res.status(500).json({
                                        success: false,
                                        message: "Internal server error",
                                        error: error.message,
                                      });
                                    }
                                  };
                                  
                                  module.exports = {
                                    getTodayCigarettes,
                                  };


10. services/cigaretteService
                              const db = require('../db/database');
                              function getCigarettesForToday() {
                                return new Promise((resolve, reject) => {
                                  const today = new Date().getDate();
                              
                                  db.all(`
                                    SELECT c.id, c.name, c.brand
                                    FROM monthly_cigarette_plan mcp
                                    JOIN cigarettes c ON c.id = mcp.cigarette_id
                                    WHERE mcp.day_of_month = ?
                                  `, [today], (err, rows) => {
                              
                                    if (err) return reject(err);
                              
                                    if (!rows || rows.length === 0) {
                                      return resolve({ 
                                        success: false,
                                        message: "No cigarettes assigned for today",
                                        data: [],
                                      });
                                    }
                              
                                    resolve({
                                      success: true,
                                      message: "Cigarettes for today fetched successfully",
                                      data: rows,
                                    });
                                  });
                                });
                              }
                              
                              module.exports = {
                                getCigarettesForToday,
                              };

