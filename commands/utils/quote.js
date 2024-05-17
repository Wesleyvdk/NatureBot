const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    let quotes = [
      '"The best way to keep secrets, is not knowing them in the first place"',
      '"When you let reality win and stop dreaming, you die inside."',
      "\"There's no law that says you can't go after someone just because he's already in love with someone else.\"",
      "\"Don't worry when I fight with you... Worry when I stop because there's nothing left for us to fight for.\"",
      '"Never lose yourself when trying to hold on to someone who doesn\'t care about losing you."',
      '"Only a fool would make himself/herself endure unnecessary pain"',
      '"Sometimes knowing something... Is worse than not knowing anything"',
      '"Nothing in this world becomes yours if you don’t move to acquire it."',
      "Traditions that don’t benefit people today are worthless.",
      "\"I'm not dumb, I'm just to lazy to show how smart I am\"",
      '"some goodbyes can only be healed by a “See you again“."',
      "\"Trying to not hurt others is something you can't do. People are creatures who hurt others just by existing even if they're not aware of it. whether you're living or dying. you'll always be hurting someone. Once you're involved, you'll hurt someone, and even by not being involved, you might be hurting someone else as well\"",
      '"you will never be defeated by what they say about you, you will only be defeated by what you say about you"',
      '"Life is not a game of luck. If you wanna win, work hard."',
      '"People with talent often have the wrong impression that things will go as they think."',
      '"I’ve never once thought of you as an ally. Not you. Not him. Not her. All people are nothing but tools. It doesn’t matter how its done. It doesn’t matter what needs to be sacrificed. In this world, winning is everything. As long as I win in the end…That’s all that matters."',
      "\"You can't take back the answer you already gave out. There's no use in crying over spilt milk. The egg you broke, won' come back. All the horses and soldiers of a king will never return to his side again. it doesn't matter what was said. You can never wipe away a bad impression. Even though the opposite is simple in comparison. Just one word will make someone appear hateful. Just doing one thing would make you seem hateful. That's why excuses are meaningless. because even those excuses will make you look hateful.\"",
      '"If both worlds were just full of suffering, What\'s the point of stepping out of this one and into yours?"',
      '"If you want love, You have to learn how to change."',
      '"What the hell is with everyone telling me to change? I don\'t want other people telling me who I am"',
      '"Saying “I can change myself“ is just admitting defeat in order to adapt to this cold cruel world, so that you can be its slave. It\'s no more than a basis for deceiving yourself and decorating it with pretty words."',
      "\"Sometimes those who don't socialize much aren't actually Anti-Social, they just have no tolerance for drama and fake people\"",
      '"Society say “Just be yourself“. But then they still judge you"',
      '"apologizing won\'t repair the damage of the past"',
      '"When someone does something nice for you... Shut up and accept it!"',
      "\"you know, you have to at least try. You'll never be able to do anything if you're too afraid.\"",
      "\"I'm fine with being a monster. I'm fine with having fake emotions. But I'll protect you. Because I am me! Even if I'm just a fake... To me, I'm the only real one!\"",
      "\"I'm afraid of myself, because I'm a monster.\"",
      '"Even if everyone calls you a liar, even if you hate yourself, I\'ll be on your side."',
      '"Fear is the path to the dark side. Fear leads to anger, anger leads to hate, hate leads to suffering."',
      "\"The world offers up a choice to live or die. Survival of the fittest, that's the only governing law this world recognizes. As a result, we'll offer funeral songs to those selected out. Hence the moniker.\"",
      "\"No, but I can learn. I'll bathe in blood if that's what it takes to protect my friends, I'll take it. All the haterd, the disease, I'll take it as my own and end it.\"",
      '"I was wrong, kindness is pointless."',
      '"From where I stand, I\'d say society is certainly not equal. Not a bit"',
      '"Your shortcoming is that you assume others will hold you back, and put them at a distance from the start."',
      "\"If I can't do something, I'll be holding the group back... I, who looked down my nose at the others and called them worthless... When it comes down to it, not only I am useless, I'm resolving things with violence. It's utterly absurd\"",
      '"I, for one, feel no need to make friends"',
      '"Being alone is not synonymous with being lonely"',
      '"Inside every person you know, there is a person you don\'t know."',
      '"People do not die from suicide, They die from sadness"',
      '"Never underestimate the power of insecurity. A damaged soul will always love you more than the life itself."',
      '"Lonely is not a feeling when you are alone. Lonely is a feeling when no one cares."',
      '"All this time, I seriously thought it\'s better to die than to live life alone"',
      "\"I'm a strong person. but do you know what makes me cry? It's when I gave my best, but I still feel useless.\"",
      '"I\'m sorry I gave you everything I had without making sure if you wanted it."',
      "\"Let me tell you, it's not that I don't know how to start a conversation, It's that I don't start pointless conversations.\"",
      "\"How could I possibly pull this off?! This isn't something one person can do alone! Especially not me, a lowlife who cheated to get good grades! A good-for-nothing who thinks about nothing but himself! A vain loser whose only desire is for others to see him in a good light! That's who I am.\"",
      '"Sometimes tears are a sign of unspoken happiness, and a smile a sign of silent pain."',
      '"Why should I apologize for being a monster? Has anyone ever apologized for turning me into one?"',
      "\"As long as it's for the right cause, there's nothing wrong with playing dirty.\"",
      '"Never trust anyone too much, remember the devil was once an angel."',
      "\"Books are nice, aren't they? With just one sentence you can get lost in all sorts of dreams. The way I think of it, literature allows the reader's consciousness to deeply relish the author and be closer to him. And so, we freely walk around the world of the story from the yarn spinner's point of view. It's only when you immerse yourself in the world of a book that you are able to forget just who you are.\"",
      "\"There's no way someone who can't even protect himself can protect others, is there?\"",
      "\"sleep doesn't help if it's your soul that is tired.\"",
      '"I will never hate you for not loving me anymore. But I hate myself for still loving you"',
      '"You told me that dreams can come true. But you forgot to tell me that nightmares are dreams too."',
      "\"You don't need a gun. you don't need a pill. If you ever wanna die, fall in love and you'll get killed\"",
      '"**People** were created to be loved. **things** were created to be used. The reason why the world is in chaos is because **things** are loved and **people** are being used."',
      '"Be careful about who you trust and tell your problems to. Not everyone who smiles at you is your friend."',
      '"If my friends were to jump of a bridge, I wouldn\'t join them. I would be at the bottom to catch them."',
      '"people with talent often have the wrong impression that things will go as they think."',
      '"The truth is. Everyone is going to hurt you. You just gotta find the ones worth suffering for..."',
      "\"Pretty words aren't always true. And true words aren't always pretty.\"",
      '"No one notecies your tears, sadness, or pain. But they all notice your mistakes."',
      "\"Just because you're right, doesn't mean I'm wrong. You just haven't seen life from my side.\"",
      "\"I prefer to distance myself whenever I'm in a bad mood. Because I'll become the most heartless person you'll ever meet.\"",
      '"Even if you\'re weak, there are miracles you can seize with your hands if you fight on to the very end."',
      "\"If you can't find a reason to fight, then you shouldn't be fighting.\"",
      '"When the pain is too much, We let free the demon inside us."',
      '"The difference between the novice and the master is that the master has failed more times than the novice has tried."',
      "\"Treat me like a king and I'll treat you like a queen. But if you treat me like a game, I'll show you how its played.\"",
      '"Love is nothing more than a cultural idea attached to our pre-existing genetic needs to reproduce and gain recognition from our peers."',
      '"Trying to forget someone you love is like trying to remember someone you never met."',
      '"All good things must come to an end."',
      '"Evil is in the eye of the beholder."',
      '"Going without socks nor shoes on, into the snow. hurts more than a broken heart https://imgur.com/a/QWBgO7L "',
      "\"Some say it's painful to wait for someone, some say it's painful to forget someone. But the worst pain comes when you don't know whether to wait or whether to forget. \"",
      '"If you keep looking down on everyone, you won\'t notice your own weaknesses."',
      "\"Don't trust anyone, even your own shadow leaves you when it's dark\"",
      '"I knew that one day, I\'d become a memory. so I tried my best to become good one."',
      "\"The fact that I'm silent doesn't mean I have nothing to say.\"",
      '"Forgetting is like a wound. The wound may heal but it already left a scar."',
      '"Whether you win or lose, you can always come out ahead by learning from the experience."',
      "\"Don't push yourself too hard, even if it's for your crush\"",
      '"Everyone has to die some day. But what they believed in will never fade away as long as someone protects it."',
      '"Strength is the only thing that matters everything else is just an illusion for the weak people."',
      '"Time doesn\'t heal pain, you just learn to live with it."',
      "\"I know I'm hurt. But if I can still move at all, I can't stay still. I have to do something.\"",
      '"There are people who only care about the chapter you\'re in now, but others look further in your past and read the whole book."',
      '"I just wanted to be better, stronger, and achieve something great."',
      '"There is nothing more cruel than letting a dream end mid-way."',
      '"Wake up to reality. Nothing goes as planned in this world."',
      '"No matter what lies you tell, you can\'t fool your own heart."',
      '"I always wondered: I was born to die, so what was my reason for existing in this world?"',
      '"Freedom is so beautiful, yet so cruel."',
      '"There are many types of different monsters in this world. But the worst monsters are monsters who seek friendship but don’t know how to love"',
      "\"I have no clue what's going on here, but I'll act like I do.\"",
      '"Trust will lead you to your own grave."',
      '"The world will not be any better to you, if you\'re a good person."',
      "\"It's not the world that is broken, it's the people on it.\"",
      '"A man doesn\'t cry because he is weak, he cries because he has been strong for too long."',
      '"You will never realize you\'re lonely until you have a bunch of things to talk about, but no one to talk to about it."',
      '"Sorry I\'m late, I got lost in the path of life."',
      "\"A smile doesn't always mean a person is happy, sometimes it simply means they're strong enough to face their problems.\"",
      '"Real pain is the resulf of losing someone you care about."',
      '"If someone wants to try and take my freedom, I won\'t hesitate to take theirs."',
      '"Why did I end up having to chase after the back of someone who was always behind me."',
      '"It hurts the most when the person that gave you the best memories, becomes one."',
      '"Never let someone in your way to achieve your dream."',
      '"The world judges me on the decisions I made, never on the options I had to choose from."',
      '"If love is just a word, then why does it hurt so much."',
      '"I can forgive you a thousand times, but I\'ll only trust you once."',
      '"Nobody notices your sorrow or pain, but they will notice your mistakes."',
      '"Push through the pain. Giving up hurts more."',
      '"Learn to treasure your life. Because unfortunately it can be taken away from you any moment."',
      '"No one cared who I was, until I put a mask on."',
      '"I will kill anyone who ruins my happiness"',
      '"There is no shame in being weak. The shame is in choosing to stay weak."',
      '"Being sad is actually a good thing. It means you have something to be sad about, which means you\'ve been happy."',
      '"A time comes when you start to realize how little people love you for you, but for what you provide for them"',
      '"So I was not born with a whole lot of natural talent... But I work hard and never give up. That is my gift."',
      '"Don\'t go judging me so fast, you only see what I chose to show you."',
      '"There are 2 types of pain. The pain that hurts you, and the pain that changes you."',
      '"The original song brings a feeling a hope to the future.... To soothe ones heart and mend ones soul... In this one.... You hear the cry of someone’s pain, the bleak chance that there will be a tomorrow....To play the strings of ones shattered heart and sing the melody of a broken, forgotten soul.. The corruption of ones mind."',
      "\"You can't skip chapters. You have to read every line and meet every character. you won't enjoy all of it. Hell, some chapters may make you cry for weeks.\n You will read things you do not wish to read and you will have moments you never want te pages to end. but you have to keep going.\"",
      '"You turned right into the person you said you\'d never be."',
      "“Sometimes I feel like I’m losing everyone. But in reality, I’m just losing myself.”",
      '"Dead people receive more flowers than the living ones because regret is stronger than gratitude"',
      '"The saddest feeling is hugging your pillow and imagining its a person"',
      '"One of the worst feelings is that a fictional character cares about you more than your parents-"',
      "\"Anytime my mom asks me if i'm alright, I just say 'I'm tired' because I don't want to tell the woman who gave me life, that I don't want it anymore...\"",
      "“Suicide doesn’t end the chances of life getting worse, it eliminates the possibility of it getting better”",
      '"There is no point in living, but there isn’t any point in dying either. Just, emptiness. Idk what to do anymore... I’m just existing.."',
      "\"it's funny because people don't even come to your birthday when you\re on your feet but when you die there are more people they rather see you laying down than see you on your own 2 feet.\"",
      '"They say sharing is caring, and I honestly do not care"',
      '"The longer you live.. the more you realize that reality is just made of pain, suffering, and emptiness..."',
      '"When you grow up you tend to get told the world is the way it is and your life is just to live your life inside the world.Try not to bash into the walls too much.\nTry to have a nice family life, have fun, save a little money.\nThat\'s a very limited life.\nLife can be much broader once you discover one simple fact, And that is – everything around you that you call life, was made up by people that were no smarter than you."',
      "\"𝘐𝘧 𝘵𝘩𝘢𝘵'𝘴 𝘸𝘩𝘢𝘵 𝘪𝘵 𝘵𝘢𝘬𝘦𝘴. 𝘞𝘩𝘦𝘵𝘩𝘦𝘳 𝘺𝘰𝘶'𝘳𝘦 𝘴𝘢𝘥, 𝘰𝘳 𝘩𝘶𝘳𝘵 𝘰𝘳 𝘦𝘮𝘱𝘵𝘺 𝘠𝘰𝘶 𝘩𝘢𝘷𝘦 𝘵𝘰 𝘬𝘦𝘦𝘱 𝘱𝘭𝘢𝘺𝘪𝘯𝘨. 𝘍𝘰𝘳 𝘱𝘦𝘰𝘱𝘭𝘦 𝘭𝘪𝘬𝘦 𝘶𝘴, 𝘢 𝘭𝘪𝘧𝘦 𝘸𝘪𝘵𝘩𝘰𝘶𝘵 𝘮𝘶𝘴𝘪𝘤 𝘪𝘴 𝘥𝘦𝘢𝘵𝘩\"",
      `someone tell me why this scum is claiming to be a king? In the hands of an incompetent, power brings nothing but ruin. This must be the work of imbeciles. *Wait no, please, spare our lives. we beg of you.* These humans are complete idiots. Now I want you to think as hard as those puny brains of yours can manage. Have you ever spared a pig or a cow, because it begged you for it's life?`,
    ];
    //will calculate which one to send
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    //sends the random quote

    interaction.editReply(randomQuote);
  },
};
