var CardAbilities = [
{
        title: "Fireball",
        proficiency: "Arcana",
        natural: 4,
        scale: 0.2,
        max: 8,
        reach: 4,
        will: 2,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Poison Whip ",
        proficiency: "Arcana",
        natural: 2,
        scale: 0.5,
        max: 12,
        reach: 3,
        will: 4,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Frost Lance",
        proficiency: "Arcana",
        natural: 6,
        scale: 0.5,
        max: 16,
        reach: 3,
        will: 3,
        type: "ATTACK",
        sprite: 'Fireball.png'
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
        sprite: 'Fireball.png'
    },
{
        title: "Waterweave",
        proficiency: "Arcana",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 4,
        will: 5,
        type: "SPELL",
        sprite: 'Fireball.png'
    },
{
        title: "Lightning Step",
        proficiency: "Arcana",
        natural: 0,
        scale: 0.3,
        max: 0,
        reach: 3,
        will: 3,
        type: "SELF",
        sprite: 'Fireball.png'
    },
{
        title: "Geomancer",
        proficiency: "Arcana",
        natural: 10,
        scale: .334,
        max: 0,
        reach: 5,
        will: 6,
        type: "TRAP",
        sprite: 'Fireball.png'
    },
    {
        title: "Gale",
        proficiency: "Arcana",
        natural: 6,
        scale: 0.25,
        max: 11,
        reach: 1,
        will: 4,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Gale",
        proficiency: "Arcana",
        natural: 6,
        scale: 0.25,
        max: 11,
        reach: 3,
        will: 4,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Cleave",
        proficiency: "Force",
        natural: 6,
        scale: 0.5,
        max: 16,
        reach: 2,
        will: 2,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Bloodlust",
        proficiency: "Force",
        natural: 0,
        scale: 0,
        max: 0,
        reach: 0,
        will: 4,
        type: "SELF",
        sprite: 'Fireball.png'
    },
{
        title: "Frenzy",
        proficiency: "Force",
        natural: 4,
        scale: 0.5,
        max: 13,
        reach: 2,
        will: 3,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Intrepid Strike",
        proficiency: "Force",
        natural: 8,
        scale: 1,
        max: 28,
        reach: 2,
        will: 7,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Offhand Blow",
        proficiency: "Force",
        natural: 4,
        scale: 1,
        max: 24,
        reach: 2,
        will: 5,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Grapple",
        proficiency: "Force",
        natural: 4,
        scale: 0.5,
        max: 14,
        reach: 2,
        will: 3,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Dauntless Advance",
        proficiency: "Force",
        natural: 0,
        scale: 0.5,
        max: 0,
        reach: 2,
        will: 4,
        type: "SELF",
        sprite: 'Fireball.png'
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
        sprite: 'Fireball.png'
    },
{
        title: "Trueshot",
        proficiency: "Clarity",
        natural: 3,
        scale: 0.5,
        max: 13,
        reach: 6,
        will: 2,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Skyfather's Arrow",
        proficiency: "Clarity",
        natural: 6,
        scale: 1,
        max: 26,
        reach: 10,
        will: 9,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Nether Whisper",
        proficiency: "Clarity",
        natural: 4,
        scale: 0.334,
        max: 11,
        reach: 6,
        will: 4,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Hail of Iron",
        proficiency: "Clarity",
        natural: 3,
        scale: 0.334,
        max: 10,
        reach: 6,
        will: 4,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Barrage",
        proficiency: "Clarity",
        natural: 4,
        scale: 0.5,
        max: 14,
        reach: 4,
        will: 5,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Windsplitter",
        proficiency: "Clarity",
        natural: 4,
        scale: 0.334,
        max: 11,
        reach: 8,
        will: 3,
        type: "ATTACK",
        sprite: 'Fireball.png'
    },
{
        title: "Bushwack",
        proficiency: "Clarity",
        natural: 10,
        scale: 0.334,
        max: 0,
        reach: 3,
        will: 4,
        type: "TRAP",
        sprite: 'Fireball.png'
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
        sprite: 'Fireball.png'
    }
    ];
var numOfCards = 0;

var myCards =[
    {
        card: null,
        slot: 1,
        x: 60,
        y: 340,
        button: null,
        removeButton: null,
        cardDesc: null
    },
    {
        card: null,
        slot: 2,
        x: 130,
        y: 340,
        button: null,
        removeButton: null,
        cardDesc: null
    },
    {
        card: null,
        slot: 3,
        x: 200,
        y: 340,
        button: null,
        removeButton: null,
        cardDesc: null
    },
    {
        card: null,
        slot: 4,
        x: 60,
        y: 460,
        button: null,
        removeButton: null,
        cardDesc: null
    },
    {
        card: null,
        slot: 5,
        x: 130,
        y: 460,
        button: null,
        removeButton: null,
        cardDesc: null
    },
    {
        card: null,
        slot: 6,
        x: 200,
        y: 460,
        button: null,
        removeButton: null,
        cardDesc: null
    },
];


