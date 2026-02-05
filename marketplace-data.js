// Trenches Marketplace - Shared Data
// Loaded by marketplace.html and marketplace-item.html

const TBUCKS_SVG = '<svg viewBox="0 0 24 24" width="1em" height="1em"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">T</text></svg>';

const RARITIES = {
    common:    { label: 'Common',    color: '#b0b0b0', bg: 'linear-gradient(135deg, #4a4a4a, #2a2a2a)' },
    uncommon:  { label: 'Uncommon',  color: '#30b030', bg: 'linear-gradient(135deg, #2d7a2d, #1a4a1a)' },
    rare:      { label: 'Rare',      color: '#3090ff', bg: 'linear-gradient(135deg, #1a5276, #0d2847)' },
    epic:      { label: 'Epic',      color: '#b040ff', bg: 'linear-gradient(135deg, #6a2d9c, #3a1560)' },
    legendary: { label: 'Legendary', color: '#ff8c00', bg: 'linear-gradient(135deg, #b8640b, #6b3a08)' },
};

const ITEM_TYPES = ['Weapon Skin', 'Character Skin', 'Accessory', 'Emote'];

const COLORS = [
    { name: 'Red', hex: '#ff4444' },
    { name: 'Blue', hex: '#4488ff' },
    { name: 'Green', hex: '#44ff44' },
    { name: 'Purple', hex: '#aa44ff' },
    { name: 'Gold', hex: '#ffcc00' },
    { name: 'Black', hex: '#333333' },
    { name: 'White', hex: '#eeeeee' },
    { name: 'Pink', hex: '#ff66cc' },
];

const SEASONS = ['Season 1', 'Season 2', 'Season 3', 'Pre-Season'];

const PROGRAMS = ['Battle Pass', 'Limited Drop', 'Store Exclusive', 'Tournament Reward'];

const ITEMS = [
    {
        id: 'golden-ak47',
        name: 'Golden AK-47',
        type: 'Weapon Skin',
        rarity: 'legendary',
        price: 4500,
        season: 'Season 1',
        program: 'Limited Drop',
        color: 'Gold',
        emoji: '\u{1F52B}',
        description: 'A gilded instrument of destruction. Only 500 were minted on-chain.',
        specs: 'Animated gold particle effects, custom reload animation, unique equip sound.'
    },
    {
        id: 'neon-katana',
        name: 'Neon Katana',
        type: 'Weapon Skin',
        rarity: 'epic',
        price: 2800,
        season: 'Season 2',
        program: 'Battle Pass',
        color: 'Purple',
        emoji: '\u2694\uFE0F',
        description: 'A blade that cuts through the darkness with blazing neon trails.',
        specs: 'Neon trail effect, purple glow on equip.'
    },
    {
        id: 'diamond-hands',
        name: 'Diamond Hands',
        type: 'Accessory',
        rarity: 'legendary',
        price: 5200,
        season: 'Season 1',
        program: 'Store Exclusive',
        color: 'Blue',
        emoji: '\u{1F48E}',
        description: 'For those who never sell. Diamond-encrusted tactical gloves.',
        specs: 'Sparkle effect on melee, reflective surfaces.'
    },
    {
        id: 'trench-coat-noir',
        name: 'Trench Coat Noir',
        type: 'Character Skin',
        rarity: 'epic',
        price: 3200,
        season: 'Season 1',
        program: 'Store Exclusive',
        color: 'Black',
        emoji: '\u{1F576}\uFE0F',
        description: 'A mysterious operator draped in shadows.',
        specs: 'Shadow particle trail, dark smoke on elimination.'
    },
    {
        id: 'solana-visor',
        name: 'Solana Visor',
        type: 'Accessory',
        rarity: 'rare',
        price: 1200,
        season: 'Season 2',
        program: 'Battle Pass',
        color: 'Purple',
        emoji: '\u{1F97D}',
        description: 'High-tech visor displaying real-time blockchain data.',
        specs: 'Holographic HUD overlay effect.'
    },
    {
        id: 'pepe-warlord',
        name: 'Pepe Warlord',
        type: 'Character Skin',
        rarity: 'legendary',
        price: 4800,
        season: 'Season 1',
        program: 'Limited Drop',
        color: 'Green',
        emoji: '\u{1F438}',
        description: 'The rare and legendary Pepe, battle-hardened and ready for war.',
        specs: 'Custom victory animation, rare emote unlock, green particle effects.'
    },
    {
        id: 'rocket-boots',
        name: 'Rocket Boots',
        type: 'Accessory',
        rarity: 'uncommon',
        price: 800,
        season: 'Season 2',
        program: 'Battle Pass',
        color: 'Red',
        emoji: '\u{1F462}',
        description: 'Boots with jet propulsion. Cosmetic only — no actual flying.',
        specs: 'Flame trail on sprint, custom landing effect.'
    },
    {
        id: 'ghost-recon',
        name: 'Ghost Recon',
        type: 'Character Skin',
        rarity: 'rare',
        price: 1800,
        season: 'Season 3',
        program: 'Store Exclusive',
        color: 'White',
        emoji: '\u{1F47B}',
        description: 'A translucent spectral operator. Spooky but effective.',
        specs: 'Semi-transparent character model, ghostly trail.'
    },
    {
        id: 'doge-dance',
        name: 'Doge Dance',
        type: 'Emote',
        rarity: 'rare',
        price: 600,
        season: 'Season 1',
        program: 'Store Exclusive',
        color: 'Gold',
        emoji: '\u{1F436}',
        description: 'Much dance. Very moves. Wow.',
        specs: '3-second loop emote with unique audio.'
    },
    {
        id: 'laser-rifle-aurora',
        name: 'Laser Rifle Aurora',
        type: 'Weapon Skin',
        rarity: 'epic',
        price: 3000,
        season: 'Season 3',
        program: 'Battle Pass',
        color: 'Pink',
        emoji: '\u{1F4A5}',
        description: 'A northern-lights themed energy weapon wrap.',
        specs: 'Aurora borealis shimmer, color-shifting barrel.'
    },
    {
        id: 'basic-camo',
        name: 'Basic Camo',
        type: 'Weapon Skin',
        rarity: 'common',
        price: 200,
        season: 'Pre-Season',
        program: 'Store Exclusive',
        color: 'Green',
        emoji: '\u{1F332}',
        description: 'Standard issue camouflage. Gets the job done.',
        specs: 'Simple camo pattern wrap.'
    },
    {
        id: 'chad-operator',
        name: 'Chad Operator',
        type: 'Character Skin',
        rarity: 'epic',
        price: 3500,
        season: 'Season 2',
        program: 'Limited Drop',
        color: 'Black',
        emoji: '\u{1F4AA}',
        description: 'The ultimate sigma grindset skin. Pure alpha energy.',
        specs: 'Sunglasses glint effect, custom walk cycle.'
    },
    {
        id: 'victory-floss',
        name: 'Victory Floss',
        type: 'Emote',
        rarity: 'uncommon',
        price: 400,
        season: 'Pre-Season',
        program: 'Store Exclusive',
        color: 'White',
        emoji: '\u{1F57A}',
        description: 'The classic floss. Assert dominance post-elimination.',
        specs: '4-second loop emote.'
    },
    {
        id: 'inferno-blade',
        name: 'Inferno Blade',
        type: 'Weapon Skin',
        rarity: 'rare',
        price: 1500,
        season: 'Season 3',
        program: 'Tournament Reward',
        color: 'Red',
        emoji: '\u{1F525}',
        description: 'A melee weapon engulfed in eternal flame.',
        specs: 'Fire particle effect, ember trail on swing.'
    },
    {
        id: 'crypto-wings',
        name: 'Crypto Wings',
        type: 'Accessory',
        rarity: 'legendary',
        price: 5000,
        season: 'Season 2',
        program: 'Tournament Reward',
        color: 'Gold',
        emoji: '\u{1F985}',
        description: 'Holographic wings displaying live price charts. Pure flex.',
        specs: 'Animated holographic wings, unique glide animation.'
    },
    {
        id: 'rug-pull-shuffle',
        name: 'Rug Pull Shuffle',
        type: 'Emote',
        rarity: 'epic',
        price: 1000,
        season: 'Season 1',
        program: 'Limited Drop',
        color: 'Red',
        emoji: '\u{1FA79}',
        description: 'An ironic dance celebrating the darker side of crypto.',
        specs: '5-second emote with rug-pull sound effect.'
    },
    {
        id: 'stealth-wrap',
        name: 'Stealth Wrap',
        type: 'Weapon Skin',
        rarity: 'uncommon',
        price: 500,
        season: 'Season 3',
        program: 'Store Exclusive',
        color: 'Black',
        emoji: '\u{1F5E1}\uFE0F',
        description: 'Matte black weapon finish. No reflections, no mercy.',
        specs: 'Matte black finish, reduced muzzle flash visual.'
    },
    {
        id: 'rainbow-armor',
        name: 'Rainbow Armor',
        type: 'Character Skin',
        rarity: 'rare',
        price: 1600,
        season: 'Pre-Season',
        program: 'Battle Pass',
        color: 'Pink',
        emoji: '\u{1F308}',
        description: 'Iridescent plating that shifts color in the light.',
        specs: 'Color-shifting armor panels, rainbow trail on elimination.'
    },
    {
        id: 'moon-walk',
        name: 'Moon Walk',
        type: 'Emote',
        rarity: 'common',
        price: 150,
        season: 'Pre-Season',
        program: 'Store Exclusive',
        color: 'White',
        emoji: '\u{1F31D}',
        description: 'One small step for man, one giant flex in the trenches.',
        specs: '3-second loop with low gravity effect.'
    },
    {
        id: 'toxic-spill',
        name: 'Toxic Spill',
        type: 'Weapon Skin',
        rarity: 'uncommon',
        price: 700,
        season: 'Season 1',
        program: 'Battle Pass',
        color: 'Green',
        emoji: '\u2622\uFE0F',
        description: 'Dripping with radioactive green. Handle with care.',
        specs: 'Green drip particle effect, toxic glow.'
    },
];
