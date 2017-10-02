var CardAbilities = [
{
        title: "Fireball",
        proficiency: "Arcana",
        natural: 4,
        scale: 0.5,
        max: 8,
        reach: 5,
        will: 3,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Poison Whip ",
        proficiency: "Arcana",
        natural: 2,
        scale: 2,
        max: 12,
        reach: 4,
        will: 5,
        type: "ATTACK",
        sprite: 'PoisonWhip.png'
    },
{
        title: "Frost Lance",
        proficiency: "Arcana",
        natural: 6,
        scale: 1.5,
        max: 16,
        reach: 5,
        will: 5,
        type: "ATTACK",
        sprite: 'FrostLance.png'
    },
{
        title: "Stone Skin",
        proficiency: "Arcana",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 0,
        will: 6,
        type: "SELF",
        sprite: 'StoneSkin.png',
        effect: "+1 and +1 for\nevery 3 Arcana to damage\nreduction permanently."
    },
{
        title: "Waterweave",
        proficiency: "Arcana",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 5,
        will: 7,
        type: "SPELL",
        sprite: 'Waterweave.png',
        effect: "Heals 2 and\n+2 for every 3 Arcana to\nthe target's health."
    },
{
        title: "Lightning Step",
        proficiency: "Arcana",
        natural: 0,
        scale: 0.3,
        max: 0,
        reach: 3,
        will: 4,
        type: "SELF",
        sprite: 'LightningStep.png',
        effect: "+10 toward\nyour next roll and +1\nfor every 1 Clarity"

    },
{
        title: "Geomancer",
        proficiency: "Arcana",
        natural: 10,
        scale: 1,
        max: 0,
        reach: 5,
        will: 7,
        type: "TRAP",
        sprite: 'Geomancer.png',
        effect: "Place a trap. Any\nunits who end turn on\ntrap will receive damage."
    },

{
        title: "Gale",
        proficiency: "Arcana",
        natural: 6,
        scale: 0.5,
        max: 11,
        reach: 4,
        will: 5,
        type: "ATTACK",
        sprite: 'Gale.png'
    },
{
        title: "Cleave",
        proficiency: "Force",
        natural: 6,
        scale: 0.5,
        max: 16,
        reach: 2,
        will: 3,
        type: "ATTACK",
        sprite: 'Cleave.png'
    },
{
        title: "Bloodlust",
        proficiency: "Force",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 0,
        will: 5,
        type: "SELF",
        sprite: 'Bloodlust.png',
        effect: "+2 and +1\nfor every 4 Force to\nyour next attack."
    },
{
        title: "Frenzy",
        proficiency: "Force",
        natural: 4,
        scale: 0.5,
        max: 13,
        reach: 2,
        will: 4,
        type: "ATTACK",
        sprite: 'Frenzy.png'
    },
{
        title: "Intrepid Strike",
        proficiency: "Force",
        natural: 8,
        scale: 1,
        max: 28,
        reach: 2,
        will: 9,
        type: "ATTACK",
        sprite: 'IntrepidStrike.png'
    },
{
        title: "Offhand Blow",
        proficiency: "Force",
        natural: 2,
        scale: 1,
        max: 24,
        reach: 2,
        will: 6,
        type: "ATTACK",
        sprite: 'OffhandBlow.png'
    },
{
        title: "Grapple",
        proficiency: "Force",
        natural: 4,
        scale: 0.5,
        max: 14,
        reach: 2,
        will: 4,
        type: "ATTACK",
        sprite: 'Grapple.png'
    },
{
        title: "Dauntless Advance",
        proficiency: "Force",
        natural: 0,
        scale: 0.5,
        max: 0,
        reach: 2,
        will: 5,
        type: "SELF",
        sprite: 'DauntlessAdvance.png',
        effect: "+5 and\n+1 for every Force\ntoward your next roll."
    },
{
        title: "Adanai's Embrace",
        proficiency: "Force",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 0,
        will: 4,
        type: "SELF",
        sprite: 'AdanaisEmbrace.png',
        effect: "Absorbs up\nto 2 and +1 for every\n3 Force damage. Expires\nafter you get attacked."
    },
{
        title: "First Aid",
        proficiency: "Force",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 3,
        will: 6,
        type: "SPELL",
        sprite: 'Fireball.png',
        effect: "Heals 2 and\n+1 for every 3 Force to the\ntarget's health. +20% HP\nrecovery for one turn."

    },
{
        title: "Trueshot",
        proficiency: "Clarity",
        natural: 3,
        scale: 0.5,
        max: 13,
        reach: 6,
        will: 3,
        type: "ATTACK",
        sprite: 'Trueshot.png'
    },
{
        title: "Skyfather's Arrow",
        proficiency: "Clarity",
        natural: 6,
        scale: 1,
        max: 26,
        reach: 8,
        will: 10,
        type: "ATTACK",
        sprite: 'SkyfathersArrow.png'
    },
{
        title: "Nether Whisper",
        proficiency: "Clarity",
        natural: 4,
        scale: 1,
        max: 11,
        reach: 6,
        will: 8,
        type: "ATTACK",
        sprite: 'NetherWhisper.png'
    },
{
        title: "Hail of Iron",
        proficiency: "Clarity",
        natural: 3,
        scale: 0.5,
        max: 10,
        reach: 6,
        will: 4,
        type: "ATTACK",
        sprite: 'HailyofIron.png'
    },
{
        title: "Barrage",
        proficiency: "Clarity",
        natural: 4,
        scale: 1,
        max: 14,
        reach: 4,
        will: 6,
        type: "ATTACK",
        sprite: 'Barrage.png'
    },
{
        title: "Windsplitter",
        proficiency: "Clarity",
        natural: 4,
        scale: 0.5,
        max: 11,
        reach: 7,
        will: 5,
        type: "ATTACK",
        sprite: 'Windsplitter.png'
    },
{
        title: "Bushwack",
        proficiency: "Clarity",
        natural: 10,
        scale: 0.334,
        max: 0,
        reach: 3,
        will: 5,
        type: "TRAP",
        sprite: 'Bushwack.png',
        effect: "Place a trap. Any\nunits who end turn on\ntrap will receive damage."
    },
{
        title: "Oros' Blessing",
        proficiency: "Clarity",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 0,
        will: 4,
        type: "SELF",
        sprite: 'OrosBlessing.png',
        effect: "For this\nturn, all abilities gain 1\nand +1 for every 5\nClarity toward Reach."
    },
{
        title: "Injection",
        proficiency: "Clarity",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 4,
        will: 5,
        type: "SPELL",
        sprite: 'Fireball.png',
        effect: "+3 and +1\nfor every Clarity to\nthe target's next attack."
    }
    ];
var numOfCards = 0;

var myCards =[
    {
        card: null,
        slot: 1,
        x: 60,
        y: 420,
        button: null,
        removeButton: null,
        cardDesc: null,
        isPressed: false
    },
    {
        card: null,
        slot: 2,
        x: 130,
        y: 420,
        button: null,
        removeButton: null,
        cardDesc: null,
        isPressed: false
    },
    {
        card: null,
        slot: 3,
        x: 200,
        y: 420,
        button: null,
        removeButton: null,
        cardDesc: null,
        isPressed: false
    },
    {
        card: null,
        slot: 4,
        x: 60,
        y: 500,
        button: null,
        removeButton: null,
        cardDesc: null,
        isPressed: false
    },
    {
        card: null,
        slot: 5,
        x: 130,
        y: 500,
        button: null,
        removeButton: null,
        cardDesc: null,
        isPressed: false
    },
    {
        card: null,
        slot: 6,
        x: 200,
        y: 500,
        button: null,
        removeButton: null,
        cardDesc: null,
        isPressed: false
    },
];


