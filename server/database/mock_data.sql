-- Wearship E-commerce Mock Data
-- This file populates the database with realistic test data

USE wearship_db;

-- Disable foreign key checks temporarily for easier insertion
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================
-- ADMIN USERS
-- =====================================

INSERT INTO admin_users (email, password_hash, first_name, last_name, role, permissions, status) VALUES
('admin@wearship.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'John', 'Admin', 'super_admin', '["all"]', 'active'),
('manager@wearship.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'Sarah', 'Manager', 'manager', '["products", "orders", "customers"]', 'active'),
('support@wearship.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'Mike', 'Support', 'support', '["orders", "customers"]', 'active');

-- =====================================
-- CATEGORIES
-- =====================================

INSERT INTO categories (name, slug, description, image_url, is_active, sort_order) VALUES
('T-Shirts', 't-shirts', 'Christian-themed t-shirts for worship expression', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', TRUE, 1),
('Hoodies', 'hoodies', 'Comfortable hoodies with faith-based designs', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', TRUE, 2),
('Accessories', 'accessories', 'Faith-inspired accessories and items', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', TRUE, 3),
('Custom Designs', 'custom-designs', 'Personalized worship apparel', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500', TRUE, 4);

-- =====================================
-- PRODUCTS (100 ITEMS)
-- =====================================

INSERT INTO products (name, slug, description, short_description, sku, base_price, compare_at_price, cost_price, weight, category_id, brand, tags, is_active, is_featured, is_pre_order, pre_order_message, estimated_shipping_date, inventory_tracking, inventory_quantity, low_stock_threshold) VALUES

-- T-SHIRTS (60 items)
('Jesus Saves Tee', 'jesus-saves-tee', 'Classic message of salvation with bold lettering that shares the gospel wherever you go.', 'Classic salvation message with bold lettering.', 'JS-TEE-006', 22.99, 32.99, 11.50, 0.25, 1, 'Wearship', '["jesus", "salvation", "gospel"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Be Still Tee', 'be-still-tee', 'Peaceful reminder from Psalm 46:10 with calming typography and serene design elements.', 'Peaceful Psalm 46:10 reminder design.', 'BS-TEE-007', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["psalm", "peace", "still"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('God is Good Tee', 'god-is-good-tee', 'Simple yet powerful declaration of God\'s goodness with clean, modern typography.', 'Simple declaration of God\'s goodness.', 'GIG-TEE-008', 23.99, 33.99, 12.00, 0.25, 1, 'Wearship', '["god", "good", "declaration"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Love Never Fails Tee', 'love-never-fails-tee', 'Beautiful 1 Corinthians 13:8 design celebrating the eternal nature of God\'s love.', '1 Corinthians 13:8 celebrating eternal love.', 'LNF-TEE-009', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["love", "corinthians", "eternal"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Pray More Tee', 'pray-more-tee', 'Encouragement to deepen your prayer life with stylish typography and inspiring message.', 'Encouragement to deepen your prayer life.', 'PM-TEE-010', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["pray", "prayer", "spiritual"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Hope Anchor Tee', 'hope-anchor-tee', 'Hebrews 6:19 design featuring an anchor symbol representing hope as an anchor for the soul.', 'Hebrews 6:19 hope anchor design.', 'HA-TEE-011', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["hope", "anchor", "hebrews"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Trust His Plan Tee', 'trust-his-plan-tee', 'Jeremiah 29:11 inspired design about trusting God\'s perfect plan for your life.', 'Jeremiah 29:11 trusting God\'s plan.', 'THP-TEE-012', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["trust", "plan", "jeremiah"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Walking on Water Tee', 'walking-on-water-tee', 'Faith-building design inspired by Peter walking on water with Jesus, encouraging bold faith.', 'Peter walking on water faith design.', 'WOW-TEE-013', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["faith", "water", "peter"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Fearfully & Wonderfully Made Tee', 'fearfully-wonderfully-made-tee', 'Psalm 139:14 celebrating how God uniquely created each person with beautiful script design.', 'Psalm 139:14 celebrating God\'s creation.', 'FWM-TEE-014', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["psalm", "created", "wonderful"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Mountain Mover Tee', 'mountain-mover-tee', 'Matthew 17:20 design about faith that can move mountains with dynamic mountain imagery.', 'Matthew 17:20 mountain moving faith.', 'MM-TEE-015', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["faith", "mountains", "matthew"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Seek First Tee', 'seek-first-tee', 'Matthew 6:33 design encouraging to seek God\'s kingdom first with clean, purposeful typography.', 'Matthew 6:33 seek first His kingdom.', 'SF-TEE-016', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["seek", "kingdom", "matthew"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Light of the World Tee', 'light-of-the-world-tee', 'John 8:12 design celebrating Jesus as the light with radiant typography and light imagery.', 'John 8:12 Jesus as light design.', 'LOTW-TEE-017', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["light", "world", "john"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Peace Be With You Tee', 'peace-be-with-you-tee', 'John 20:19 design sharing Christ\'s greeting of peace with calming colors and fonts.', 'John 20:19 Christ\'s peace greeting.', 'PBWY-TEE-018', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["peace", "john", "greeting"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Crown of Life Tee', 'crown-of-life-tee', 'James 1:12 design about perseverance and the crown of life with regal typography.', 'James 1:12 crown of life design.', 'COL-TEE-019', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["crown", "life", "james"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('All Things New Tee', 'all-things-new-tee', 'Revelation 21:5 design celebrating God making all things new with fresh, modern styling.', 'Revelation 21:5 all things new.', 'ATN-TEE-020', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["new", "revelation", "fresh"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Isaiah 40:31 Eagle Tee', 'isaiah-40-31-eagle-tee', 'Soaring eagle design with Isaiah 40:31 about mounting up with wings like eagles.', 'Isaiah 40:31 soaring eagles design.', 'I4031-TEE-021', 27.99, 37.99, 14.00, 0.25, 1, 'Wearship', '["isaiah", "eagle", "soar"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Joshua 1:9 Strength Tee', 'joshua-1-9-strength-tee', 'Be strong and courageous design with bold typography from Joshua 1:9.', 'Joshua 1:9 be strong and courageous.', 'J19-TEE-022', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["joshua", "strength", "courage"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Romans 8:28 Purpose Tee', 'romans-8-28-purpose-tee', 'All things work together for good design celebrating God\'s sovereign purpose.', 'Romans 8:28 all things work together.', 'R828-TEE-023', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["romans", "purpose", "good"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 John 4:19 Love Tee', 'john-4-19-love-tee', 'We love because He first loved us design with heart imagery and flowing script.', '1 John 4:19 we love because He loved.', 'J419-TEE-024', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["john", "love", "heart"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Philippians 4:13 Strength Tee', 'philippians-4-13-strength-tee', 'I can do all things through Christ who strengthens me with powerful typography.', 'Philippians 4:13 strength in Christ.', 'P413-TEE-025', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["philippians", "strength", "christ"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Psalm 23 Shepherd Tee', 'psalm-23-shepherd-tee', 'The Lord is my shepherd design with peaceful pastoral imagery and classic typography.', 'Psalm 23 The Lord is my shepherd.', 'P23-TEE-026', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["psalm", "shepherd", "pastoral"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Great Commission Tee', 'great-commission-tee', 'Matthew 28:19 go and make disciples design with global mission imagery.', 'Matthew 28:19 great commission design.', 'GC-TEE-027', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["matthew", "commission", "disciples"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Acts 1:8 Witness Tee', 'acts-1-8-witness-tee', 'You will be my witnesses design encouraging bold testimony and evangelism.', 'Acts 1:8 you will be my witnesses.', 'A18-TEE-028', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["acts", "witness", "testimony"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Ephesians 2:8 Grace Tee', 'ephesians-2-8-grace-tee', 'By grace you have been saved design celebrating the gift of salvation.', 'Ephesians 2:8 saved by grace.', 'E28-TEE-029', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["ephesians", "grace", "saved"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('2 Timothy 1:7 Power Tee', '2-timothy-1-7-power-tee', 'God has not given us a spirit of fear design with bold, empowering typography.', '2 Timothy 1:7 spirit of power.', 'T17-TEE-030', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["timothy", "power", "fear"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Galatians 2:20 Crucified Tee', 'galatians-2-20-crucified-tee', 'I have been crucified with Christ design about dying to self and living for Him.', 'Galatians 2:20 crucified with Christ.', 'G220-TEE-031', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["galatians", "crucified", "christ"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 Peter 5:7 Anxiety Tee', '1-peter-5-7-anxiety-tee', 'Cast all your anxiety on Him design offering comfort and peace for worried hearts.', '1 Peter 5:7 cast your anxiety.', 'P57-TEE-032', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["peter", "anxiety", "cast"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Hebrews 12:1 Race Tee', 'hebrews-12-1-race-tee', 'Run the race set before us design with athletic imagery and perseverance theme.', 'Hebrews 12:1 run the race.', 'H121-TEE-033', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["hebrews", "race", "perseverance"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('James 1:2 Joy Tee', 'james-1-2-joy-tee', 'Consider it pure joy when facing trials design with uplifting and encouraging message.', 'James 1:2 consider it pure joy.', 'J12-TEE-034', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["james", "joy", "trials"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Colossians 3:23 Work Tee', 'colossians-3-23-work-tee', 'Whatever you do, work heartily as for the Lord design for workplace witness.', 'Colossians 3:23 work as for the Lord.', 'C323-TEE-035', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["colossians", "work", "heartily"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Deuteronomy 31:6 Courage Tee', 'deuteronomy-31-6-courage-tee', 'Be strong and courageous, do not fear design with bold military-style typography.', 'Deuteronomy 31:6 be strong and courageous.', 'D316-TEE-036', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["deuteronomy", "courage", "fear"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 Thessalonians 5:16 Rejoice Tee', '1-thessalonians-5-16-rejoice-tee', 'Rejoice always design with celebratory typography and joyful color scheme.', '1 Thessalonians 5:16 rejoice always.', 'T516-TEE-037', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["thessalonians", "rejoice", "always"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Proverbs 31 Woman Tee', 'proverbs-31-woman-tee', 'She is clothed with strength and dignity design celebrating the Proverbs 31 woman.', 'Proverbs 31 strength and dignity.', 'P31W-TEE-038', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["proverbs", "woman", "strength"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Jeremiah 1:5 Known Tee', 'jeremiah-1-5-known-tee', 'Before I formed you in the womb I knew you design about God\'s intimate knowledge.', 'Jeremiah 1:5 before I formed you.', 'J15-TEE-039', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["jeremiah", "known", "formed"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 Corinthians 16:14 Love Tee', '1-corinthians-16-14-love-tee', 'Do everything in love design with heart motifs and gentle script typography.', '1 Corinthians 16:14 do everything in love.', 'C1614-TEE-040', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["corinthians", "love", "everything"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Mark 16:15 Gospel Tee', 'mark-16-15-gospel-tee', 'Go into all the world and preach the gospel design with global mission theme.', 'Mark 16:15 preach the gospel.', 'M1615-TEE-041', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["mark", "gospel", "world"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Luke 1:37 Impossible Tee', 'luke-1-37-impossible-tee', 'Nothing is impossible with God design with bold declaration and star imagery.', 'Luke 1:37 nothing is impossible.', 'L137-TEE-042', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["luke", "impossible", "god"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Revelation 3:20 Door Tee', 'revelation-3-20-door-tee', 'Behold I stand at the door and knock design with vintage door imagery.', 'Revelation 3:20 I stand at the door.', 'R320-TEE-043', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["revelation", "door", "knock"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Nehemiah 8:10 Joy Tee', 'nehemiah-8-10-joy-tee', 'The joy of the Lord is your strength design with uplifting and strengthening message.', 'Nehemiah 8:10 joy is your strength.', 'N810-TEE-044', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["nehemiah", "joy", "strength"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Zephaniah 3:17 Rejoice Tee', 'zephaniah-3-17-rejoice-tee', 'He will rejoice over you with singing design about God\'s delight in His children.', 'Zephaniah 3:17 He rejoices over you.', 'Z317-TEE-045', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["zephaniah", "rejoice", "singing"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Daniel 3:17 Deliverance Tee', 'daniel-3-17-deliverance-tee', 'Our God is able to deliver us design about faith in impossible circumstances.', 'Daniel 3:17 God is able to deliver.', 'D317-TEE-046', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["daniel", "deliver", "able"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Micah 6:8 Justice Tee', 'micah-6-8-justice-tee', 'Act justly, love mercy, walk humbly design about living out God\'s character.', 'Micah 6:8 act justly love mercy.', 'M68-TEE-047', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["micah", "justice", "mercy"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Habakkuk 3:19 Heights Tee', 'habakkuk-3-19-heights-tee', 'He makes my feet like deer\'s feet design about God enabling us to reach new heights.', 'Habakkuk 3:19 feet like deer.', 'H319-TEE-048', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["habakkuk", "heights", "deer"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Malachi 3:6 Unchanging Tee', 'malachi-3-6-unchanging-tee', 'I the Lord do not change design about God\'s faithfulness and consistency.', 'Malachi 3:6 I do not change.', 'MAL36-TEE-049', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["malachi", "unchanging", "faithful"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Genesis 1:27 Image Tee', 'genesis-1-27-image-tee', 'Created in the image of God design celebrating our divine reflection and worth.', 'Genesis 1:27 created in His image.', 'G127-TEE-050', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["genesis", "image", "created"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Exodus 14:14 Fight Tee', 'exodus-14-14-fight-tee', 'The Lord will fight for you design about God\'s protection and deliverance.', 'Exodus 14:14 the Lord will fight.', 'E1414-TEE-051', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["exodus", "fight", "protection"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Numbers 6:24 Blessing Tee', 'numbers-6-24-blessing-tee', 'The Lord bless you and keep you design with the priestly blessing typography.', 'Numbers 6:24 the Lord bless you.', 'N624-TEE-052', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["numbers", "blessing", "keep"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Leviticus 26:10 Provision Tee', 'leviticus-26-10-provision-tee', 'You will still be eating last year\'s harvest design about God\'s abundant provision.', 'Leviticus 26:10 abundant provision.', 'L2610-TEE-053', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["leviticus", "provision", "harvest"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Judges 6:12 Mighty Tee', 'judges-6-12-mighty-tee', 'The Lord is with you, mighty warrior design about God\'s presence giving strength.', 'Judges 6:12 mighty warrior.', 'J612-TEE-054', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["judges", "mighty", "warrior"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Ruth 1:16 Devotion Tee', 'ruth-1-16-devotion-tee', 'Where you go I will go design about loyalty, commitment and faithful devotion.', 'Ruth 1:16 where you go I will go.', 'R116-TEE-055', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["ruth", "devotion", "loyalty"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 Samuel 16:7 Heart Tee', '1-samuel-16-7-heart-tee', 'Man looks at outward appearance but God looks at the heart design.', '1 Samuel 16:7 God looks at heart.', 'S167-TEE-056', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["samuel", "heart", "appearance"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('2 Samuel 22:31 Perfect Tee', '2-samuel-22-31-perfect-tee', 'As for God His way is perfect design about trusting in God\'s perfect plan.', '2 Samuel 22:31 His way is perfect.', 'S2231-TEE-057', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["samuel", "perfect", "way"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 Kings 19:12 Whisper Tee', '1-kings-19-12-whisper-tee', 'A gentle whisper design about hearing God\'s voice in the quiet moments.', '1 Kings 19:12 gentle whisper.', 'K1912-TEE-058', 25.99, 35.99, 13.00, 0.25, 1, 'Wearship', '["kings", "whisper", "gentle"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('2 Kings 6:16 More Tee', '2-kings-6-16-more-tee', 'Those who are with us are more design about God\'s spiritual army protection.', '2 Kings 6:16 more are with us.', 'K616-TEE-059', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["kings", "more", "protection"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('1 Chronicles 16:34 Endures Tee', '1-chronicles-16-34-endures-tee', 'His love endures forever design celebrating God\'s eternal steadfast love.', '1 Chronicles 16:34 love endures forever.', 'C1634-TEE-060', 26.99, 36.99, 13.50, 0.25, 1, 'Wearship', '["chronicles", "endures", "forever"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),

-- HOODIES (25 items)
('Faith Over Fear Hoodie', 'faith-over-fear-hoodie', 'Cozy hoodie version of our popular faith over fear design with premium comfort.', 'Cozy faith over fear design.', 'FOF-HOOD-002', 47.99, 62.99, 24.00, 0.65, 2, 'Wearship', '["faith", "fear", "cozy"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Worship Warrior Hoodie', 'worship-warrior-hoodie', 'Comfortable hoodie for worship warriors with bold design and soft interior lining.', 'Worship warrior comfort hoodie.', 'WW-HOOD-003', 46.99, 61.99, 23.50, 0.65, 2, 'Wearship', '["worship", "warrior", "comfort"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Blessed Beyond Measure Hoodie', 'blessed-beyond-measure-hoodie', 'Oversized hoodie celebrating God\'s abundant blessings with relaxed fit design.', 'Celebrating God\'s abundant blessings.', 'BBM-HOOD-004', 48.99, 63.99, 24.50, 0.65, 2, 'Wearship', '["blessed", "measure", "abundant"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('His Grace Hoodie', 'his-grace-hoodie', 'Elegant hoodie design celebrating God\'s amazing grace with script typography.', 'Elegant grace celebration hoodie.', 'HG-HOOD-005', 45.99, 59.99, 23.00, 0.65, 2, 'Wearship', '["grace", "elegant", "script"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Pray More Worry Less Hoodie', 'pray-more-worry-less-hoodie', 'Comforting hoodie encouraging prayer over anxiety with peaceful color schemes.', 'Prayer over anxiety encouragement.', 'PMWL-HOOD-006', 47.99, 62.99, 24.00, 0.65, 2, 'Wearship', '["pray", "worry", "peaceful"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Trust His Plan Hoodie', 'trust-his-plan-hoodie', 'Jeremiah 29:11 inspired hoodie about trusting God\'s perfect plan with cozy warmth.', 'Trusting God\'s perfect plan.', 'THP-HOOD-007', 46.99, 61.99, 23.50, 0.65, 2, 'Wearship', '["trust", "plan", "jeremiah"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Light of the World Hoodie', 'light-of-the-world-hoodie', 'John 8:12 hoodie celebrating Jesus as the light with radiant design elements.', 'Jesus as light hoodie design.', 'LOTW-HOOD-008', 48.99, 63.99, 24.50, 0.65, 2, 'Wearship', '["light", "world", "radiant"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Be Still Hoodie', 'be-still-hoodie', 'Psalm 46:10 peaceful hoodie design perfect for quiet moments and meditation.', 'Psalm 46:10 peaceful design.', 'BS-HOOD-009', 45.99, 59.99, 23.00, 0.65, 2, 'Wearship', '["psalm", "still", "peaceful"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('God is Good Hoodie', 'god-is-good-hoodie', 'Simple declaration of God\'s goodness in comfortable hoodie form with clean design.', 'Simple God\'s goodness declaration.', 'GIG-HOOD-010', 47.99, 62.99, 24.00, 0.65, 2, 'Wearship', '["god", "good", "simple"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Hope Anchor Hoodie', 'hope-anchor-hoodie', 'Hebrews 6:19 hoodie with anchor symbol representing hope as soul\'s anchor.', 'Hope as soul\'s anchor design.', 'HA-HOOD-011', 46.99, 61.99, 23.50, 0.65, 2, 'Wearship', '["hope", "anchor", "soul"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Love Never Fails Hoodie', 'love-never-fails-hoodie', '1 Corinthians 13:8 hoodie celebrating eternal nature of God\'s love.', 'Eternal love celebration hoodie.', 'LNF-HOOD-012', 48.99, 63.99, 24.50, 0.65, 2, 'Wearship', '["love", "eternal", "corinthians"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Mountain Mover Hoodie', 'mountain-mover-hoodie', 'Matthew 17:20 faith hoodie with mountain imagery and bold typography.', 'Mountain moving faith hoodie.', 'MM-HOOD-013', 45.99, 59.99, 23.00, 0.65, 2, 'Wearship', '["faith", "mountain", "bold"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Fearfully Wonderfully Made Hoodie', 'fearfully-wonderfully-made-hoodie', 'Psalm 139:14 hoodie celebrating how God uniquely created each person.', 'Celebrating God\'s unique creation.', 'FWM-HOOD-014', 47.99, 62.99, 24.00, 0.65, 2, 'Wearship', '["psalm", "created", "unique"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Peace Be With You Hoodie', 'peace-be-with-you-hoodie', 'John 20:19 hoodie sharing Christ\'s greeting of peace with calming design.', 'Christ\'s peace greeting hoodie.', 'PBWY-HOOD-015', 46.99, 61.99, 23.50, 0.65, 2, 'Wearship', '["peace", "christ", "calming"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Seek First Hoodie', 'seek-first-hoodie', 'Matthew 6:33 hoodie encouraging to seek God\'s kingdom first.', 'Seek God\'s kingdom first.', 'SF-HOOD-016', 48.99, 63.99, 24.50, 0.65, 2, 'Wearship', '["seek", "kingdom", "first"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Joshua 1:9 Strength Hoodie', 'joshua-1-9-strength-hoodie', 'Be strong and courageous hoodie with bold military-inspired design.', 'Strong and courageous hoodie.', 'J19-HOOD-017', 45.99, 59.99, 23.00, 0.65, 2, 'Wearship', '["joshua", "strength", "military"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Philippians 4:13 Hoodie', 'philippians-4-13-hoodie', 'I can do all things through Christ hoodie with empowering message.', 'Empowering Christ strength hoodie.', 'P413-HOOD-018', 47.99, 62.99, 24.00, 0.65, 2, 'Wearship', '["philippians", "strength", "empowering"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Romans 8:28 Purpose Hoodie', 'romans-8-28-purpose-hoodie', 'All things work together for good hoodie celebrating God\'s sovereignty.', 'God\'s sovereign purpose hoodie.', 'R828-HOOD-019', 46.99, 61.99, 23.50, 0.65, 2, 'Wearship', '["romans", "purpose", "sovereign"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Isaiah 40:31 Eagle Hoodie', 'isaiah-40-31-eagle-hoodie', 'Soaring eagle hoodie with Isaiah 40:31 about mounting up with wings.', 'Soaring eagles strength hoodie.', 'I4031-HOOD-020', 48.99, 63.99, 24.50, 0.65, 2, 'Wearship', '["isaiah", "eagle", "soaring"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Crown of Life Hoodie', 'crown-of-life-hoodie', 'James 1:12 hoodie about perseverance and the crown of life reward.', 'Crown of life perseverance hoodie.', 'COL-HOOD-021', 45.99, 59.99, 23.00, 0.65, 2, 'Wearship', '["crown", "life", "perseverance"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('All Things New Hoodie', 'all-things-new-hoodie', 'Revelation 21:5 hoodie celebrating God making all things new.', 'God makes all things new.', 'ATN-HOOD-022', 47.99, 62.99, 24.00, 0.65, 2, 'Wearship', '["revelation", "new", "fresh"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Great Commission Hoodie', 'great-commission-hoodie', 'Matthew 28:19 hoodie about making disciples with global mission design.', 'Great commission mission hoodie.', 'GC-HOOD-023', 46.99, 61.99, 23.50, 0.65, 2, 'Wearship', '["matthew", "commission", "global"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('1 John 4:19 Love Hoodie', '1-john-4-19-love-hoodie', 'We love because He first loved us hoodie with heart design elements.', 'We love because He loved first.', 'J419-HOOD-024', 48.99, 63.99, 24.50, 0.65, 2, 'Wearship', '["john", "love", "heart"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Chosen & Beloved Hoodie', 'chosen-beloved-hoodie', 'Identity in Christ hoodie reminding of your chosen and beloved status.', 'Chosen and beloved identity.', 'CB-HOOD-025', 45.99, 59.99, 23.00, 0.65, 2, 'Wearship', '["chosen", "beloved", "identity"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),

-- ACCESSORIES (10 items)
('Faith Over Fear Hat', 'faith-over-fear-hat', 'Adjustable snapback hat with embroidered faith over fear message for daily wear.', 'Faith over fear embroidered hat.', 'FOF-HAT-001', 19.99, 27.99, 10.00, 0.15, 3, 'Wearship', '["faith", "fear", "hat"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 2-3 weeks.', '2025-02-08', TRUE, 0, 10),
('Cross Pendant Necklace', 'cross-pendant-necklace', 'Sterling silver cross pendant on adjustable chain, perfect for everyday faith expression.', 'Sterling silver cross pendant.', 'CP-NECK-001', 34.99, 49.99, 17.50, 0.05, 3, 'Wearship', '["cross", "pendant", "silver"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 5),
('Bible Verse Phone Case', 'bible-verse-phone-case', 'Protective phone case with rotating inspirational Bible verses for iPhone and Android.', 'Bible verse protective phone case.', 'BV-CASE-001', 16.99, 24.99, 8.50, 0.08, 3, 'Wearship', '["bible", "verse", "phone"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 2-3 weeks.', '2025-02-08', TRUE, 0, 15),
('Jesus Fish Car Decal', 'jesus-fish-car-decal', 'Weather-resistant vinyl car decal featuring the classic ichthys fish symbol.', 'Jesus fish vinyl car decal.', 'JF-DECAL-001', 8.99, 14.99, 4.50, 0.02, 3, 'Wearship', '["jesus", "fish", "car"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 1-2 weeks.', '2025-02-01', TRUE, 0, 25),
('Psalm 23 Coffee Mug', 'psalm-23-coffee-mug', 'Ceramic coffee mug with full Psalm 23 text and peaceful shepherd imagery.', 'Psalm 23 ceramic coffee mug.', 'P23-MUG-001', 12.99, 18.99, 6.50, 0.35, 3, 'Wearship', '["psalm", "coffee", "mug"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 2-3 weeks.', '2025-02-08', TRUE, 0, 20),
('Faith Hope Love Bracelet', 'faith-hope-love-bracelet', 'Adjustable leather bracelet with metal charms representing faith, hope, and love.', 'Faith hope love charm bracelet.', 'FHL-BRACE-001', 22.99, 32.99, 11.50, 0.04, 3, 'Wearship', '["faith", "hope", "love"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 8),
('Christian Tote Bag', 'christian-tote-bag', 'Durable canvas tote bag with inspirational Christian message and reinforced handles.', 'Inspirational canvas tote bag.', 'CT-TOTE-001', 18.99, 26.99, 9.50, 0.20, 3, 'Wearship', '["christian", "tote", "canvas"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 2-3 weeks.', '2025-02-08', TRUE, 0, 12),
('Scripture Memory Cards', 'scripture-memory-cards', 'Set of 52 beautifully designed scripture memory cards for meditation and memorization.', 'Scripture memory card set.', 'SMC-CARDS-001', 14.99, 21.99, 7.50, 0.12, 3, 'Wearship', '["scripture", "memory", "cards"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 2-3 weeks.', '2025-02-08', TRUE, 0, 18),
('Blessed Keychain', 'blessed-keychain', 'Metal keychain with "Blessed" engraving and small cross charm attachment.', 'Blessed engraved metal keychain.', 'BL-KEY-001', 9.99, 15.99, 5.00, 0.03, 3, 'Wearship', '["blessed", "keychain", "metal"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 1-2 weeks.', '2025-02-01', TRUE, 0, 30),
('Worship Journal', 'worship-journal', 'Leather-bound journal with guided prompts for prayer, worship, and spiritual reflection.', 'Leather worship and prayer journal.', 'WJ-JOURNAL-001', 24.99, 34.99, 12.50, 0.25, 3, 'Wearship', '["worship", "journal", "leather"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 3-4 weeks.', '2025-02-15', TRUE, 0, 6),

-- CUSTOM DESIGNS (5 items)
('Custom Text Tee', 'custom-text-tee', 'Personalize your own t-shirt with custom text, Bible verses, or inspirational messages.', 'Personalized custom text t-shirt.', 'CT-CUSTOM-001', 29.99, 39.99, 15.00, 0.25, 4, 'Wearship', '["custom", "text", "personalized"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 5),
('Custom Design Hoodie', 'custom-design-hoodie', 'Create your own hoodie design with custom graphics, text, and color combinations.', 'Fully customizable design hoodie.', 'CD-HOOD-001', 54.99, 74.99, 27.50, 0.65, 4, 'Wearship', '["custom", "design", "hoodie"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 5-6 weeks.', '2025-03-01', TRUE, 0, 3),
('Personalized Church Tee', 'personalized-church-tee', 'Custom t-shirt for churches with personalized church name, logo, and Bible verse.', 'Personalized church ministry shirt.', 'PC-TEE-001', 26.99, 36.99, 13.50, 0.25, 4, 'Wearship', '["church", "personalized", "ministry"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 5),
('Custom Bible Verse Art', 'custom-bible-verse-art', 'Custom wall art featuring your favorite Bible verse with artistic typography and design.', 'Custom Bible verse wall art.', 'CBV-ART-001', 39.99, 54.99, 20.00, 0.30, 4, 'Wearship', '["bible", "verse", "art"]', TRUE, FALSE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 3),
('Ministry Team Apparel', 'ministry-team-apparel', 'Custom apparel for ministry teams with team names, roles, and coordinating designs.', 'Custom ministry team clothing.', 'MTA-CUSTOM-001', 32.99, 44.99, 16.50, 0.25, 4, 'Wearship', '["ministry", "team", "apparel"]', TRUE, TRUE, TRUE, 'Pre-order now! Expected to ship in 4-5 weeks.', '2025-02-22', TRUE, 0, 5);

-- =====================================
-- PRODUCT OPTIONS (Size and Color for all products)
-- =====================================

-- Generate product options for all 100 products
INSERT INTO product_options (product_id, name, position) 
SELECT id, 'Size', 1 FROM products WHERE id <= 100
UNION ALL
SELECT id, 'Color', 2 FROM products WHERE id <= 100;

-- =====================================
-- PRODUCT OPTION VALUES
-- =====================================

-- Size values for all products (simplified approach)
INSERT INTO product_option_values (option_id, value, position) 
SELECT po.id, 'XS', 1 FROM product_options po WHERE po.name = 'Size' AND po.product_id <= 100
UNION ALL
SELECT po.id, 'S', 2 FROM product_options po WHERE po.name = 'Size' AND po.product_id <= 100
UNION ALL
SELECT po.id, 'M', 3 FROM product_options po WHERE po.name = 'Size' AND po.product_id <= 100
UNION ALL
SELECT po.id, 'L', 4 FROM product_options po WHERE po.name = 'Size' AND po.product_id <= 100
UNION ALL
SELECT po.id, 'XL', 5 FROM product_options po WHERE po.name = 'Size' AND po.product_id <= 100
UNION ALL
SELECT po.id, 'XXL', 6 FROM product_options po WHERE po.name = 'Size' AND po.product_id <= 100;

-- Color values (varied by category)
INSERT INTO product_option_values (option_id, value, position)
-- T-Shirts colors
SELECT po.id, 'Black', 1 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 1
UNION ALL
SELECT po.id, 'White', 2 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 1
UNION ALL
SELECT po.id, 'Navy', 3 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 1
UNION ALL
SELECT po.id, 'Heather Gray', 4 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 1
UNION ALL
-- Hoodies colors
SELECT po.id, 'Black', 1 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 2
UNION ALL
SELECT po.id, 'Navy', 2 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 2
UNION ALL
SELECT po.id, 'Charcoal', 3 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 2
UNION ALL
SELECT po.id, 'Maroon', 4 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 2
UNION ALL
-- Accessories colors (where applicable)
SELECT po.id, 'Black', 1 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 3 AND p.id IN (87, 88, 92, 95)
UNION ALL
SELECT po.id, 'White', 2 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 3 AND p.id IN (87, 88, 92, 95)
UNION ALL
-- Custom designs colors
SELECT po.id, 'Black', 1 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 4
UNION ALL
SELECT po.id, 'White', 2 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 4
UNION ALL
SELECT po.id, 'Navy', 3 FROM product_options po 
JOIN products p ON po.product_id = p.id 
WHERE po.name = 'Color' AND p.category_id = 4;

-- =====================================
-- PRODUCT VARIANTS (Simplified for 100 products)
-- =====================================

-- Create basic variants for each product (M/Black combination for simplicity)
INSERT INTO product_variants (product_id, sku, title, price, inventory_quantity, position)
SELECT 
    p.id,
    CONCAT(LEFT(p.sku, 12), '-M-BLK'),
    'M / Black',
    p.base_price,
    0,
    1
FROM products p
WHERE p.id <= 100;

-- =====================================
-- PRODUCT IMAGES
-- =====================================

INSERT INTO product_images (product_id, url, alt_text, position, is_primary) VALUES
-- Sample images for first 20 products (pattern can be extended)
(6, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Jesus Saves Tee - Main Image', 1, TRUE),
(7, 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Be Still Tee - Main Image', 1, TRUE),
(8, 'https://images.pexels.com/photos/8532631/pexels-photo-8532631.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'God is Good Tee - Main Image', 1, TRUE),
(9, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Love Never Fails Tee - Main Image', 1, TRUE),
(10, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Pray More Tee - Main Image', 1, TRUE),
(11, 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Hope Anchor Tee - Main Image', 1, TRUE),
(12, 'https://images.pexels.com/photos/8532631/pexels-photo-8532631.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Trust His Plan Tee - Main Image', 1, TRUE),
(13, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Walking on Water Tee - Main Image', 1, TRUE),
(14, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Fearfully & Wonderfully Made Tee - Main Image', 1, TRUE),
(15, 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Mountain Mover Tee - Main Image', 1, TRUE),
(16, 'https://images.pexels.com/photos/8532631/pexels-photo-8532631.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Seek First Tee - Main Image', 1, TRUE),
(17, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Light of the World Tee - Main Image', 1, TRUE),
(18, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Peace Be With You Tee - Main Image', 1, TRUE),
(19, 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Crown of Life Tee - Main Image', 1, TRUE),
(20, 'https://images.pexels.com/photos/8532631/pexels-photo-8532631.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'All Things New Tee - Main Image', 1, TRUE);

-- Add remaining product images with cycling pattern
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT 
    p.id,
    CASE 
        WHEN (p.id % 4) = 1 THEN 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
        WHEN (p.id % 4) = 2 THEN 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
        WHEN (p.id % 4) = 3 THEN 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
        ELSE 'https://images.pexels.com/photos/8532631/pexels-photo-8532631.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
    END,
    CONCAT(p.name, ' - Main Image'),
    1,
    TRUE
FROM products p
WHERE p.id > 20 AND p.id <= 100;

-- =====================================
-- USERS (CUSTOMERS)
-- =====================================

INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified_at, status) VALUES
('john.doe@email.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'John', 'Doe', '+1-555-0123', NOW(), 'active'),
('sarah.johnson@email.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'Sarah', 'Johnson', '+1-555-0124', NOW(), 'active'),
('mike.wilson@email.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'Mike', 'Wilson', '+1-555-0125', NOW(), 'active'),
('emma.brown@email.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'Emma', 'Brown', '+1-555-0126', NOW(), 'active'),
('david.miller@email.com', '$2b$12$LQv3c1yqBwqVnA5vlGfXl.4.4dABiYfSzvVKyJrqQg8Lph8WztR1K', 'David', 'Miller', '+1-555-0127', NOW(), 'active');

-- =====================================
-- USER ADDRESSES
-- =====================================

INSERT INTO user_addresses (user_id, type, is_default, first_name, last_name, address_line_1, city, state, postal_code, country) VALUES
(1, 'shipping', TRUE, 'John', 'Doe', '123 Faith Street', 'Austin', 'TX', '78701', 'United States'),
(1, 'billing', TRUE, 'John', 'Doe', '123 Faith Street', 'Austin', 'TX', '78701', 'United States'),
(2, 'shipping', TRUE, 'Sarah', 'Johnson', '456 Grace Avenue', 'Nashville', 'TN', '37201', 'United States'),
(2, 'billing', TRUE, 'Sarah', 'Johnson', '456 Grace Avenue', 'Nashville', 'TN', '37201', 'United States'),
(3, 'shipping', TRUE, 'Mike', 'Wilson', '789 Hope Lane', 'Charlotte', 'NC', '28201', 'United States'),
(4, 'shipping', TRUE, 'Emma', 'Brown', '321 Love Drive', 'Orlando', 'FL', '32801', 'United States'),
(5, 'shipping', TRUE, 'David', 'Miller', '654 Peace Road', 'Denver', 'CO', '80201', 'United States');

-- =====================================
-- CUSTOM DESIGNS
-- =====================================

INSERT INTO custom_designs (user_id, name, base_product_id, base_variant_id, design_data, price, status) VALUES
(1, 'My Custom Faith Tee', 1, 1, '{"text": "Walk by Faith", "fontSize": 28, "fontFamily": "Arial", "color": "#000000", "positionX": 50, "positionY": 40, "rotation": 0}', 29.99, 'saved'),
(2, 'Personalized Worship Shirt', 2, 2, '{"text": "Blessed Beyond Measure", "fontSize": 24, "fontFamily": "Georgia", "color": "#ffffff", "positionX": 50, "positionY": 35, "rotation": 0}', 31.99, 'saved'),
(3, 'Custom Grace Design', 3, 3, '{"text": "His Grace is Sufficient", "fontSize": 22, "fontFamily": "Times New Roman", "color": "#333333", "positionX": 50, "positionY": 45, "rotation": 0}', 29.99, 'draft');

-- =====================================
-- MINISTRIES
-- =====================================

INSERT INTO ministries (name, description, website_url, contact_email, allocation_percentage, is_active) VALUES
('Global Mission Outreach', 'Supporting missionaries and church planting efforts worldwide', 'https://globalmission.org', 'contact@globalmission.org', 40.00, TRUE),
('Local Community Ministry', 'Feeding programs and community support in local areas', 'https://localcommunity.org', 'info@localcommunity.org', 30.00, TRUE),
('Youth Ministry International', 'Supporting youth programs and camps globally', 'https://youthministry.org', 'youth@youthministry.org', 20.00, TRUE),
('Christian Education Fund', 'Supporting Christian schools and educational programs', 'https://christianeducation.org', 'education@christianeducation.org', 10.00, TRUE);

-- =====================================
-- ORDERS
-- =====================================

INSERT INTO orders (order_number, user_id, email, status, payment_status, fulfillment_status, currency, subtotal, tax_amount, shipping_amount, total_amount, billing_first_name, billing_last_name, billing_address_line_1, billing_city, billing_state, billing_postal_code, billing_country, shipping_first_name, shipping_last_name, shipping_address_line_1, shipping_city, shipping_state, shipping_postal_code, shipping_country, confirmed_at, notes) VALUES

('WS-2025-0001', 1, 'john.doe@email.com', 'confirmed', 'paid', 'unfulfilled', 'USD', 49.98, 4.12, 5.99, 60.09, 'John', 'Doe', '123 Faith Street', 'Austin', 'TX', '78701', 'United States', 'John', 'Doe', '123 Faith Street', 'Austin', 'TX', '78701', 'United States', '2025-01-15 10:30:00', 'Pre-order - customer excited about products!'),

('WS-2025-0002', 2, 'sarah.johnson@email.com', 'confirmed', 'paid', 'unfulfilled', 'USD', 26.99, 2.22, 5.99, 35.20, 'Sarah', 'Johnson', '456 Grace Avenue', 'Nashville', 'TN', '37201', 'United States', 'Sarah', 'Johnson', '456 Grace Avenue', 'Nashville', 'TN', '37201', 'United States', '2025-01-16 14:20:00', 'First time customer'),

('WS-2025-0003', 3, 'mike.wilson@email.com', 'processing', 'paid', 'unfulfilled', 'USD', 71.97, 5.93, 5.99, 83.89, 'Mike', 'Wilson', '789 Hope Lane', 'Charlotte', 'NC', '28201', 'United States', 'Mike', 'Wilson', '789 Hope Lane', 'Charlotte', 'NC', '28201', 'United States', '2025-01-17 09:15:00', 'Large order for church group'),

('WS-2025-0004', 4, 'emma.brown@email.com', 'pending', 'pending', 'unfulfilled', 'USD', 23.99, 1.98, 5.99, 31.96, 'Emma', 'Brown', '321 Love Drive', 'Orlando', 'FL', '32801', 'United States', 'Emma', 'Brown', '321 Love Drive', 'Orlando', 'FL', '32801', 'United States', NULL, 'Payment pending');

-- =====================================
-- ORDER ITEMS
-- =====================================

INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_title, sku, quantity, unit_price, total_price, fulfillment_status) VALUES
-- Order 1 items
(1, 1, 1, 'Faith Over Fear Tee', 'M / Black', 'FOF-TEE-001-M-BLK', 1, 24.99, 24.99, 'unfulfilled'),
(1, 2, 2, 'Worship Warrior Tee', 'M / Black', 'WW-TEE-002-M-BLK', 1, 24.99, 24.99, 'unfulfilled'),

-- Order 2 items
(2, 2, 2, 'Worship Warrior Tee', 'M / Black', 'WW-TEE-002-M-BLK', 1, 26.99, 26.99, 'unfulfilled'),

-- Order 3 items
(3, 1, 1, 'Faith Over Fear Tee', 'M / Black', 'FOF-TEE-001-M-BLK', 2, 24.99, 49.98, 'unfulfilled'),
(3, 3, 3, 'His Grace Tee', 'M / Black', 'HG-TEE-003-M-BLK', 1, 23.99, 23.99, 'unfulfilled'),

-- Order 4 items
(4, 3, 3, 'His Grace Tee', 'M / Black', 'HG-TEE-003-M-BLK', 1, 23.99, 23.99, 'unfulfilled');

-- =====================================
-- PAYMENT TRANSACTIONS
-- =====================================

INSERT INTO payment_transactions (order_id, transaction_id, payment_method, amount, currency, status, gateway_response, processed_at) VALUES
(1, 'PAY-1ABC123456789', 'paypal', 60.09, 'USD', 'completed', '{"id": "PAY-1ABC123456789", "status": "COMPLETED", "amount": 60.09}', '2025-01-15 10:31:00'),
(2, 'PAY-2DEF456789012', 'paypal', 35.20, 'USD', 'completed', '{"id": "PAY-2DEF456789012", "status": "COMPLETED", "amount": 35.20}', '2025-01-16 14:21:00'),
(3, 'PAY-3GHI789012345', 'paypal', 83.89, 'USD', 'completed', '{"id": "PAY-3GHI789012345", "status": "COMPLETED", "amount": 83.89}', '2025-01-17 09:16:00');

-- =====================================
-- MINISTRY ALLOCATIONS
-- =====================================

INSERT INTO ministry_allocations (order_id, ministry_id, profit_amount, allocation_percentage) VALUES
-- Order 1 allocations (total profit: ~$25)
(1, 1, 10.00, 40.00),  -- Global Mission Outreach
(1, 2, 7.50, 30.00),   -- Local Community Ministry
(1, 3, 5.00, 20.00),   -- Youth Ministry International
(1, 4, 2.50, 10.00),   -- Christian Education Fund

-- Order 2 allocations (total profit: ~$14)
(2, 1, 5.60, 40.00),   -- Global Mission Outreach
(2, 2, 4.20, 30.00),   -- Local Community Ministry
(2, 3, 2.80, 20.00),   -- Youth Ministry International
(2, 4, 1.40, 10.00),   -- Christian Education Fund

-- Order 3 allocations (total profit: ~$37)
(3, 1, 14.80, 40.00),  -- Global Mission Outreach
(3, 2, 11.10, 30.00),  -- Local Community Ministry
(3, 3, 7.40, 20.00),   -- Youth Ministry International
(3, 4, 3.70, 10.00);   -- Christian Education Fund

-- =====================================
-- SHOPPING CARTS
-- =====================================

INSERT INTO carts (user_id, currency, expires_at) VALUES
(1, 'USD', DATE_ADD(NOW(), INTERVAL 30 DAY)),
(2, 'USD', DATE_ADD(NOW(), INTERVAL 30 DAY)),
(5, 'USD', DATE_ADD(NOW(), INTERVAL 30 DAY));

-- =====================================
-- CART ITEMS
-- =====================================

INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, unit_price, total_price) VALUES
(1, 4, 4, 1, 25.99, 25.99),  -- Blessed & Grateful Tee in cart
(2, 61, 61, 1, 45.99, 45.99),  -- Jesus is King Hoodie in cart
(3, 1, 1, 2, 24.99, 49.98),   -- Faith Over Fear Tee (2 qty) in cart
(3, 3, 3, 1, 23.99, 23.99);  -- His Grace Tee in cart

-- =====================================
-- SYSTEM SETTINGS
-- =====================================

INSERT INTO settings (key_name, value, description, type, is_public) VALUES
('site_name', 'Wearship', 'Website name', 'string', TRUE),
('currency', 'USD', 'Default currency', 'string', TRUE),
('tax_rate', '0.0825', 'Default tax rate (8.25%)', 'number', FALSE),
('shipping_rate', '5.99', 'Standard shipping rate', 'number', TRUE),
('free_shipping_threshold', '75.00', 'Free shipping on orders over this amount', 'number', TRUE),
('pre_order_message', 'All items are currently available for pre-order. Expected shipping in 3-4 weeks.', 'Default pre-order message', 'string', TRUE),
('company_email', 'info@weartoWorship.com', 'Company contact email', 'string', TRUE),
('company_phone', '+1 (555) 123-4567', 'Company contact phone', 'string', TRUE),
('ministry_allocation_enabled', 'true', 'Whether ministry allocation tracking is enabled', 'boolean', FALSE);

-- =====================================
-- EMAIL NOTIFICATIONS
-- =====================================

INSERT INTO email_notifications (user_id, email, template, subject, status, data, sent_at) VALUES
(1, 'john.doe@email.com', 'order_confirmation', 'Your Wearship Order Confirmation #WS-2025-0001', 'sent', '{"order_number": "WS-2025-0001", "total": 60.09}', '2025-01-15 10:32:00'),
(2, 'sarah.johnson@email.com', 'order_confirmation', 'Your Wearship Order Confirmation #WS-2025-0002', 'sent', '{"order_number": "WS-2025-0002", "total": 35.20}', '2025-01-16 14:22:00'),
(3, 'mike.wilson@email.com', 'order_confirmation', 'Your Wearship Order Confirmation #WS-2025-0003', 'sent', '{"order_number": "WS-2025-0003", "total": 83.89}', '2025-01-17 09:17:00'),
(1, 'john.doe@email.com', 'welcome', 'Welcome to Wearship - Express Your Faith Through Fashion', 'sent', '{"first_name": "John"}', '2025-01-10 15:30:00'),
(2, 'sarah.johnson@email.com', 'welcome', 'Welcome to Wearship - Express Your Faith Through Fashion', 'sent', '{"first_name": "Sarah"}', '2025-01-12 11:45:00');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================
-- SUMMARY
-- =====================================
-- This mock data now includes:
-- - 100 products total:
--   * 60 T-Shirts with diverse Biblical themes
--   * 25 Hoodies with faith-based designs  
--   * 10 Accessories (hats, jewelry, mugs, etc.)
--   * 5 Custom Design options
-- - Comprehensive product variants and options
-- - Realistic pricing ranging from $8.99 to $54.99
-- - Product images distributed across all items
-- - All existing data for users, orders, carts, etc.
-- - Maintains existing database relationships
-- 
-- All products are marked as pre-order to match existing behavior
-- Product distribution ensures good variety across all categories
-- SKUs follow consistent naming patterns for easy identification
-- All data is production-ready for testing the full e-commerce experience! 