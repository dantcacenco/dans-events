import type { DJLocationData } from "@/components/dj-location-page";

export const djLocations: Record<string, DJLocationData> = {
  asheville: {
    city: "Asheville",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "asheville",
    heroTagline:
      "In the Blue Ridge Mountains, the best weddings feel like the music was chosen by someone who actually listened. That's where I come in.",
    introParagraph:
      "Asheville is my home base and the place where I've spent years learning every venue, every acoustic corner, every room that comes alive when the right song drops. Couples here tend to have strong taste — they know what they don't want, and they're right to be particular. I bring the same intentionality to every transition, every genre shift, every moment between songs. Whether you're at Biltmore Estate or a mountain farm in Hendersonville, the music should feel like it was made for this night.",
    regionDescription:
      "Western North Carolina draws couples from across the country who want something more than a hotel ballroom. The region offers barn venues, vineyard overlooks, riverside farms, and one of the most storied estates in America. The wedding culture here values authenticity over spectacle — and the music needs to match.",
    venues: [
      {
        name: "Biltmore Estate — Antler Hill Barn",
        location: "Asheville, NC",
        description:
          "A restored 1900s agricultural barn on the Biltmore grounds with soaring timber ceilings and long natural reverb — a room that rewards careful speaker placement and disciplined restraint.",
      },
      {
        name: "Omni Grove Park Inn",
        location: "Asheville, NC",
        description:
          "The grand ballrooms here have the density and height to fill beautifully — high ceilings, stone walls, and a crowd that expects the music to match the setting.",
      },
      {
        name: "The Crest Center & Pavilion",
        location: "Asheville, NC",
        description:
          "A hilltop venue with indoor and outdoor configurations — the pavilion has open sides that mean sound carries differently depending on wind, so I always bring extra speaker coverage.",
      },
      {
        name: "Highland Brewing Events Center",
        location: "East Asheville, NC",
        description:
          "Three distinct spaces with industrial acoustics that respond well to bass — the room fills fast and the energy builds early in the night.",
      },
      {
        name: "Honeysuckle Hill Events",
        location: "Asheville, NC",
        description:
          "A century-old barn with a hayloft layout that creates natural separation between dance floor and dinner — I run two zones so no table conversation gets buried.",
      },
      {
        name: "Hawk & Hawthorne",
        location: "Asheville, NC",
        description:
          "A restored tobacco barn on 50 acres with 360-degree views — the open ceremony field and the barn interior each have distinct acoustic profiles that I plan for separately.",
      },
      {
        name: "Ella Asheville",
        location: "Downtown Asheville, NC",
        description:
          "A 6,000 sq ft blank-canvas loft in the 1928 Broadway Arts Building — parallel walls create some flutter, but the room locks in once you find the right speaker angle.",
      },
      {
        name: "Hidden River Events",
        location: "Asheville, NC",
        description:
          "A working horse and flower farm with a barn that has excellent natural dampening from the wood construction — one of the warmer-sounding rooms in the area.",
      },
      {
        name: "Chestnut Ridge",
        location: "Asheville, NC",
        description:
          "A modern mountain-meets-farm estate with multiple curated outdoor event spaces — open-air configurations that benefit from directional speaker placement.",
      },
      {
        name: "The Horse Shoe Farm",
        location: "Horse Shoe, NC",
        description:
          "An 85-acre boutique resort along the French Broad River with a Sunset Barn — the loft-style layout creates energy naturally and both levels need coverage.",
      },
    ],
    nearbyAreas: [
      "Hendersonville",
      "Black Mountain",
      "Waynesville",
      "Brevard",
      "Lake Lure",
      "Weaverville",
      "Flat Rock",
      "Highlands",
    ],
    faq: [
      {
        question: "How far in advance should I book for an Asheville wedding?",
        answer:
          "Peak season runs May through October and most Saturday dates book 12–18 months out. Reach out as soon as you have a date locked, even if the venue isn't signed yet.",
      },
      {
        question: "What genres do you play at Asheville weddings?",
        answer:
          "Everything from soul and jazz during cocktail hour to indie, Motown, hip-hop, and top-40 for the reception. The mix depends entirely on your crowd — I read the room continuously and adjust. No preset playlists, no autopilot.",
      },
      {
        question: "What happens if I have a specific song request?",
        answer:
          "Send it. I keep a running list of your must-plays and do-not-plays from our first conversation through the final weeks before your date. I work your requests into the flow where they land hardest — not just drop them in at random.",
      },
    ],
  },

  boone: {
    city: "Boone",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "boone",
    heroTagline:
      "Above 3,000 feet, the air is different and the stakes are higher. High Country weddings deserve music with the same altitude.",
    introParagraph:
      "The NC High Country is about 95 miles from Asheville and worth every mile. Couples who choose Boone, Blowing Rock, Banner Elk, or Valle Crucis are making a statement about what they value — and the music needs to honor that. I've performed across this region and know the difference between a barn on Beech Mountain in October fog and a resort ballroom in Blowing Rock on a clear summer evening. The approach changes. The commitment doesn't.",
    regionDescription:
      "Watauga and Avery Counties sit along the Blue Ridge Parkway with some of the highest elevations on the East Coast. The wedding culture here skews toward long weekends, destination guests, and venues that feel like escapes. Couples want their reception to feel earned — like the music belongs to this place and this night.",
    venues: [
      {
        name: "Overlook Barn",
        location: "Beech Mountain, NC",
        description:
          "A renovated barn at high elevation with panoramic ridgeline views — the room has excellent natural warmth and a dance floor that fills fast once the energy builds.",
      },
      {
        name: "The White Crow Wedding and Event Venue",
        location: "Banner Elk, NC",
        description:
          "A 6,400 sq ft modern mountain venue with multiple ceremony sites — clean lines and high ceilings that allow for tight, even sound coverage across the room.",
      },
      {
        name: "The Mast Farm Inn",
        location: "Valle Crucis, NC",
        description:
          "A historic inn on 20 acres with intimate event spaces — small crowds in enclosed rooms where music volume is critical; I keep it conversational until the dance floor opens.",
      },
      {
        name: "Chetola Resort",
        location: "Blowing Rock, NC",
        description:
          "A 75-acre lakeside resort with both ballroom and outdoor ceremony options — the ballroom has professional acoustics and a setup that rewards a full speaker rig.",
      },
      {
        name: "Twickenham House",
        location: "Jefferson, NC",
        description:
          "A 400-acre private sanctuary with European architecture — intimate, exclusive, and built for ceremonies where every note of the processional needs to sit perfectly in the space.",
      },
      {
        name: "Twisted Oak Estate",
        location: "Banner Elk, NC",
        description:
          "A downtown Banner Elk estate venue with a refined indoor reception space — mid-sized room that projects well without needing a heavy rig.",
      },
      {
        name: "The Horton Hotel",
        location: "Boone, NC",
        description:
          "A boutique hotel rooftop with mountain views over downtown Boone — outdoor open-air setting that requires careful speaker positioning to maintain clarity.",
      },
      {
        name: "Templeton Meadows",
        location: "Boone, NC",
        description:
          "Thirty-four acres of open meadow near Boone — outdoor-primary venue where I bring additional subwoofer coverage so the bass doesn't get lost in open air.",
      },
      {
        name: "Barn at Fraser Hill",
        location: "Boone, NC",
        description:
          "A fifth-generation family farm four miles from downtown Boone with a beautifully restored barn — authentic Appalachian character and a dance floor that holds energy well.",
      },
      {
        name: "Appalachian View",
        location: "Sugar Mountain, NC",
        description:
          "A secluded high-elevation property at the top of Sugar Mountain with on-site cabins and room for up to 200 guests — built for full weekend celebrations with open mountain air sound considerations.",
      },
    ],
    nearbyAreas: [
      "Blowing Rock",
      "Banner Elk",
      "Valle Crucis",
      "Sugar Mountain",
      "Beech Mountain",
      "Jefferson",
      "Newland",
      "Linville",
    ],
    faq: [
      {
        question: "Do you travel to Boone from Asheville?",
        answer:
          "Yes. The High Country is about 95 miles from my base in Asheville. Travel fees apply beyond 60 miles and are itemized clearly in your quote — no surprises.",
      },
      {
        question: "How far in advance should I book for a High Country wedding?",
        answer:
          "Fall foliage weekends in mid-October book 14–18 months out. Summer Saturdays at the most popular venues go nearly as fast. Reach out as soon as your date is set.",
      },
      {
        question: "Can you handle outdoor ceremony sound at elevation?",
        answer:
          "Yes. Open-air sound at elevation has its own challenges — wind, natural reverb across ridgelines, distance from guests to speakers. I plan for all of it during advance prep and bring redundant equipment for remote venues.",
      },
    ],
  },

  brevard: {
    city: "Brevard",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "brevard",
    heroTagline:
      "Pisgah Forest, waterfall corridors, and creek-side farms — Brevard weddings have their own unhurried elegance.",
    introParagraph:
      "Brevard sits at the edge of Pisgah National Forest, about 35 miles from Asheville, and it attracts a specific kind of couple: outdoors-oriented, music-conscious, not interested in anything that feels mass-produced. The wedding culture here is relaxed in the best way — ceremonies under trees, receptions in barns with doors open to the summer night, dance floors that fill because the vibe is right, not because the DJ is pushing it. I match that energy. I don't force the room.",
    regionDescription:
      "Transylvania County is called the Land of Waterfalls — 250 cascades within a 30-mile radius. The region draws couples who want nature woven into every element of their wedding. Venues here range from working farms to mountain lodges, and the best ones have a quiet confidence that the music needs to honor.",
    venues: [
      {
        name: "Seven Maples",
        location: "Brevard, NC",
        description:
          "A rolling farm property along a creek with a barn and open ceremony field — the barn has natural warmth that holds sound well, and the outdoor spaces carry music cleanly on still evenings.",
      },
      {
        name: "Colvard Farms",
        location: "Mills River, NC",
        description:
          "An upscale farm venue with mountain views and multiple event spaces — the main barn has excellent acoustics and a dance floor that fills from the first set.",
      },
      {
        name: "The Horse Shoe Farm",
        location: "Horse Shoe, NC",
        description:
          "An 85-acre resort along the French Broad River with a Sunset Barn — the loft-style layout creates energy naturally, and I position speakers to cover both levels cleanly.",
      },
      {
        name: "Earthbound Farm",
        location: "Brevard, NC",
        description:
          "A laid-back mountain farm venue with a relaxed aesthetic — open-air configurations benefit from directional speaker placement to keep the dance floor distinct from the dinner area.",
      },
      {
        name: "The Cedars Eventspace",
        location: "Brevard, NC",
        description:
          "A woodland venue with an open-sided pavilion surrounded by old-growth trees — the natural canopy creates a sound environment that rewards subtlety and punishes volume overreach.",
      },
      {
        name: "Connestee Falls Country Club",
        location: "Brevard, NC",
        description:
          "A mountain country club with sweeping valley views and a traditional ballroom setting — reliable acoustics and a crowd that spans multiple generations.",
      },
    ],
    nearbyAreas: [
      "Hendersonville",
      "Mills River",
      "Asheville",
      "Rosman",
      "Pisgah Forest",
      "Cedar Mountain",
      "Lake Toxaway",
    ],
    faq: [
      {
        question: "Is Brevard within your standard service area?",
        answer:
          "Yes. Brevard is about 35 miles from Asheville — well within my no-travel-fee zone. I work in Transylvania County regularly.",
      },
      {
        question: "Do you have experience with outdoor and semi-outdoor venues?",
        answer:
          "Most of my Brevard and Pisgah-area work is at venues with open-air or semi-covered configurations. I bring the equipment needed for outdoor coverage and do advance scouting on every new venue.",
      },
      {
        question: "How do you handle sound ordinances at venues near state forest land?",
        answer:
          "Sound ordinances matter, and I take them seriously. I know which venues have curfews and decibel limits, and I plan the setlist arc so the loudest part of the night happens well before cutoff — not during it.",
      },
    ],
  },

  charlotte: {
    city: "Charlotte",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "charlotte",
    heroTagline:
      "Charlotte couples have options. The ones who find me know the difference between a DJ who shows up and one who actually runs the room.",
    introParagraph:
      "Charlotte is a two-hour drive from Asheville, and I make that trip for couples who want something different from the city's standard wedding entertainment circuit. The market here is competitive and the venues are polished — ballrooms, rooftops, historic estates, and converted industrial spaces. What separates a great wedding night from a forgettable one isn't the venue; it's who's behind the decks and how they read the room. I bring that intentionality to every Charlotte event I take.",
    regionDescription:
      "The Charlotte metro area is one of the fastest-growing wedding markets in the Southeast. Couples here tend to be sophisticated, well-traveled, and discerning about every vendor decision. The music expectation is high — and the crowd will notice immediately if the DJ is phoning it in.",
    venues: [
      {
        name: "The Mint Museum Uptown",
        location: "Charlotte, NC",
        description:
          "A contemporary art museum with dramatic gallery spaces and rooftop access — high ceilings and hard surfaces create significant reverb, requiring precise speaker delay and careful gain staging.",
      },
      {
        name: "Duke Mansion",
        location: "Charlotte, NC",
        description:
          "A 1915 Colonial Revival estate in Myers Park with intimate event spaces — original wood flooring and tall ceilings that respond warmly to live and DJ sound.",
      },
      {
        name: "The Fillmore Charlotte",
        location: "Charlotte, NC",
        description:
          "A legendary music venue with a proper live-sound room — this space was built for high-impact audio and rewards a DJ who knows how to use a professional system.",
      },
      {
        name: "Asbury",
        location: "Charlotte, NC",
        description:
          "A converted 1924 church in Plaza Midwood with original Gothic architecture — the natural reverb is significant, so I use tight speaker placement and moderate SPL to keep intelligibility.",
      },
      {
        name: "River Run Country Club",
        location: "Davidson, NC",
        description:
          "An upscale clubhouse venue overlooking a golf course — the ballroom has good acoustics and a clear sightline from DJ position to the dance floor.",
      },
      {
        name: "McNinch House Restaurant",
        location: "Charlotte, NC",
        description:
          "A historic Victorian mansion used for intimate receptions — small room dynamics require disciplined volume control and a setlist that complements rather than overwhelms the setting.",
      },
      {
        name: "The Ritz-Carlton Charlotte",
        location: "Charlotte, NC",
        description:
          "A luxury hotel ballroom with professional AV infrastructure and a crowd that expects polished execution from the first song.",
      },
      {
        name: "The Cider House at Williams and Works",
        location: "Concord, NC",
        description:
          "A renovated industrial building with exposed brick and timber — the room sounds warmer than it looks, with enough natural dampening to keep bass from building.",
      },
    ],
    nearbyAreas: [
      "Concord",
      "Mooresville",
      "Davidson",
      "Huntersville",
      "Matthews",
      "Pineville",
      "Belmont",
      "Gastonia",
    ],
    faq: [
      {
        question: "Do you travel to Charlotte from Asheville?",
        answer:
          "Yes. Charlotte is about two hours from Asheville. Travel fees apply for distances beyond 60 miles and are included transparently in your quote.",
      },
      {
        question: "What sound equipment do you use for large Charlotte ballrooms?",
        answer:
          "For larger rooms I run a professional line-array or point-source system scaled to the space, with delay fills for deep rectangular rooms. I don't bring the same rig to every event — the room determines the setup.",
      },
      {
        question: "Can you MC the wedding as well as DJ?",
        answer:
          "Yes — MC work is central to what I do, not an add-on. I handle all introductions, transitions, and toasts coordination. My background in the Slavic tamada hosting tradition means I'm trained to guide the emotional arc of a celebration, not just announce the next event.",
      },
    ],
  },

  "columbia-sc": {
    city: "Columbia",
    state: "South Carolina",
    stateAbbr: "SC",
    slug: "columbia-sc",
    heroTagline:
      "South Carolina's capital has venues with real character. The music should match.",
    introParagraph:
      "Columbia is about three hours from Asheville, and I take it for couples who want someone who treats their wedding as a craft project, not a gig. The Columbia wedding scene is anchored by historic estates, converted industrial spaces, and a few genuinely beautiful outdoor properties. Couples here tend to want Southern warmth with a modern edge — a reception that feels celebratory without feeling generic. I read that balance well.",
    regionDescription:
      "The Midlands region of South Carolina sits at the geographic center of the state, connecting the Upstate with the Lowcountry. Columbia's wedding culture reflects that position — it draws couples who want sophistication without the price tag of Charleston or Greenville, and the venue diversity here is real.",
    venues: [
      {
        name: "The Millstone at Adam's Pond",
        location: "Columbia, SC",
        description:
          "A waterfront venue on a private pond with an open-air pavilion and indoor ballroom — both spaces have good speaker placement options and the transition between them is smooth.",
      },
      {
        name: "The Hall at Senate's End",
        location: "Columbia, SC",
        description:
          "A restored 1920s building near the State Capitol with exposed brick and high ceilings — a mid-sized room with natural warmth that holds music well without excessive bounce.",
      },
      {
        name: "Soda City Loft",
        location: "Columbia, SC",
        description:
          "An urban event loft in the heart of Columbia with industrial-chic aesthetics — concrete floors and open ceilings create a live sound that rewards careful speaker aiming.",
      },
      {
        name: "The Weston",
        location: "Columbia, SC",
        description:
          "A boutique wedding venue in a repurposed historic building with a refined interior and an intimate dance floor that builds energy quickly.",
      },
      {
        name: "The Inn at USC — Wyndham Grand",
        location: "Columbia, SC",
        description:
          "A full-service hotel ballroom with professional AV infrastructure and flexible room configurations for various guest counts.",
      },
      {
        name: "The Oak Table",
        location: "Columbia, SC",
        description:
          "A farm-inspired event venue on the outskirts of Columbia with an open barn structure and pastoral grounds — outdoor-leaning setup that benefits from directional speaker coverage.",
      },
    ],
    nearbyAreas: [
      "Lexington",
      "Irmo",
      "West Columbia",
      "Cayce",
      "Blythewood",
      "Chapin",
      "Newberry",
    ],
    faq: [
      {
        question: "Do you serve Columbia, SC from Asheville?",
        answer:
          "Yes. Columbia is about three hours from my base. I take a limited number of out-of-market bookings per year, so if you're interested, reach out early.",
      },
      {
        question: "What genres work well for Columbia-area wedding crowds?",
        answer:
          "Columbia crowds tend to respond well to a mix of classic R&B, Southern rock, hip-hop, and pop — with cocktail hours leaning toward jazz and soul. That said, I build every setlist around the specific couple and their guest profile, not a regional template.",
      },
      {
        question: "Do you handle all wedding audio including ceremony?",
        answer:
          "Yes. Ceremony, cocktail hour, dinner, and reception — one person handling all audio and MC duties from start to finish. No handoffs, no gaps.",
      },
    ],
  },

  gatlinburg: {
    city: "Gatlinburg",
    state: "Tennessee",
    stateAbbr: "TN",
    slug: "gatlinburg",
    heroTagline:
      "The Smoky Mountains draw couples who want something real. The music should be just as honest.",
    introParagraph:
      "Gatlinburg and the Smoky Mountain corridor attract couples from across the Southeast and beyond who want a destination wedding grounded in a place. The venues here range from intimate chapel settings to full-service mountain lodges, and the guest profiles vary widely — which is where reading the room matters most. I travel from Asheville, about 90 minutes away, and I bring the same standard of preparation to every Smoky Mountain wedding I take.",
    regionDescription:
      "The Great Smoky Mountains National Park is the most-visited national park in the country, and Gatlinburg sits at its front door. The wedding culture here blends Appalachian tradition with destination-event expectations — couples want the beauty of the mountains with the polish of a well-run celebration.",
    venues: [
      {
        name: "The Park Vista — A DoubleTree by Hilton",
        location: "Gatlinburg, TN",
        description:
          "A full-service hotel with panoramic mountain views and professional ballroom infrastructure — a reliable room with good acoustics and flexible layouts.",
      },
      {
        name: "The Lodge at Buckberry Creek",
        location: "Gatlinburg, TN",
        description:
          "An Adirondack-style mountain lodge with intimate, wood-lined event spaces — natural warmth in the room means music sits comfortably at moderate levels.",
      },
      {
        name: "Bearskin Lodge on the River",
        location: "Gatlinburg, TN",
        description:
          "A riverside property with event spaces overlooking the West Prong of the Little Pigeon River — the sound of running water outdoors means I run a slightly hotter mix to maintain presence.",
      },
      {
        name: "Arrowmont School of Arts and Crafts",
        location: "Gatlinburg, TN",
        description:
          "A historic arts campus with unique event spaces and genuine character — the studio rooms vary in acoustics and I scout each one in advance.",
      },
      {
        name: "Gatlinburg Convention Center",
        location: "Gatlinburg, TN",
        description:
          "The largest event space in town with professional AV support — a large room that benefits from a full speaker rig with distributed coverage.",
      },
      {
        name: "LeConte Lodge",
        location: "Gatlinburg, TN",
        description:
          "A legendary mountaintop lodge accessible only by trail — for adventurous couples doing a truly unique ceremony, with intimate acoustic settings shaped entirely by the mountain environment.",
      },
    ],
    nearbyAreas: [
      "Pigeon Forge",
      "Sevierville",
      "Townsend",
      "Cosby",
      "Cherokee, NC",
      "Bryson City, NC",
      "Maggie Valley, NC",
    ],
    faq: [
      {
        question: "Do you travel to Gatlinburg from Asheville?",
        answer:
          "Yes. Gatlinburg is about 90 minutes from Asheville. Travel fees apply for distances beyond 60 miles and are clearly itemized in your quote.",
      },
      {
        question: "How do you handle weddings with guests from very different backgrounds and music preferences?",
        answer:
          "Most destination Smoky Mountain weddings have guests from multiple states and musical worlds. I read the room in real time and find the common threads — the songs that make everyone move, regardless of age or taste. That's the skill. It's not a playlist, it's a conversation with the crowd.",
      },
      {
        question: "What equipment do you bring for mountain venues with limited load-in access?",
        answer:
          "I travel with a compact, high-quality rig that scales to the room. For venues with difficult load-in — stairs, remote parking, no freight elevator — I plan accordingly and arrive early. I've never let logistics affect the music.",
      },
    ],
  },

  greensboro: {
    city: "Greensboro",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "greensboro",
    heroTagline:
      "The Piedmont Triad has a long wedding tradition and high expectations. I hold up my end.",
    introParagraph:
      "Greensboro is about three hours from Asheville and sits at the center of the Piedmont Triad — a region with deep roots in arts, textiles, and community. The wedding market here is established and the crowds are discerning. I take a limited number of Triad bookings each year and give each one the same focus I bring to events at home. Couples here tend to want a DJ who knows when to build and when to let a moment breathe — not someone filling airtime.",
    regionDescription:
      "The Piedmont Triad — Greensboro, Winston-Salem, and High Point — is one of the most populated regions in North Carolina. The wedding culture here values substance over flash, and venues range from grand historic buildings to modern urban spaces to rolling countryside estates.",
    venues: [
      {
        name: "Proximity Hotel",
        location: "Greensboro, NC",
        description:
          "A LEED-certified boutique hotel with sophisticated event spaces and a refined guest profile — a room that rewards tasteful curation and precision timing.",
      },
      {
        name: "Green Valley Grill at O. Henry Hotel",
        location: "Greensboro, NC",
        description:
          "A historic boutique hotel venue with refined event spaces and an intimate scale that calls for measured, deliberate music choices.",
      },
      {
        name: "Grandover Resort",
        location: "Greensboro, NC",
        description:
          "A full-service resort with a large ballroom and multiple outdoor options — the main ballroom has clean acoustics and good sightlines from DJ position to the dance floor.",
      },
      {
        name: "The Carolina Theater",
        location: "Greensboro, NC",
        description:
          "A 1927 performing arts venue with ornate interiors and a professional sound system — one of the most acoustically interesting spaces in the region.",
      },
      {
        name: "The Loft at Lindley Park",
        location: "Greensboro, NC",
        description:
          "A converted historic building with brick walls and a warm, intimate interior — mid-sized room with moderate reverb that benefits from cardioid speaker positioning.",
      },
      {
        name: "Bog Garden at Benjamin Park",
        location: "Greensboro, NC",
        description:
          "A scenic outdoor garden venue with natural acoustics shaped by the surrounding wetlands and tree canopy — a beautiful sound environment for ceremonies.",
      },
    ],
    nearbyAreas: [
      "Winston-Salem",
      "High Point",
      "Burlington",
      "Kernersville",
      "Asheboro",
      "Mebane",
      "Thomasville",
    ],
    faq: [
      {
        question: "Do you travel to Greensboro from Asheville?",
        answer:
          "Yes. Greensboro is about three hours from Asheville. I take a small number of Piedmont Triad bookings per year — reach out early if your date is prime season.",
      },
      {
        question: "What is your setup process for large Greensboro ballrooms?",
        answer:
          "I arrive 2–3 hours before guests for any large ballroom event, run a full soundcheck with the venue coordinator, and dial in speaker positioning based on the room layout that day. No surprises at showtime.",
      },
      {
        question: "Do you take song requests from guests during the reception?",
        answer:
          "I take requests with discretion. If a request fits the arc of the night and serves the crowd, I work it in. If it doesn't, I explain why to the guest respectfully. Your do-not-play list is always honored — no exceptions.",
      },
    ],
  },

  "greenville-sc": {
    city: "Greenville",
    state: "South Carolina",
    stateAbbr: "SC",
    slug: "greenville-sc",
    heroTagline:
      "Greenville's downtown has become one of the South's best wedding destinations. The music should be just as elevated.",
    introParagraph:
      "Greenville, SC has had a remarkable decade — the downtown is now one of the most livable and visitor-friendly in the Southeast, and the wedding venue scene has followed. Couples here tend to be aspirational, well-traveled, and specific about what they want. I'm about two hours from Asheville and I take Greenville bookings for couples who want a DJ who treats the music as the centerpiece of the night, not the background noise.",
    regionDescription:
      "Greenville sits at the foothills of the Blue Ridge Mountains on the South Carolina side, connecting mountain culture with Upstate Southern sophistication. The wedding market here has grown significantly in the last decade and now attracts couples from across the Carolinas who want Greenville's downtown energy without driving to Charlotte.",
    venues: [
      {
        name: "The Westin Poinsett",
        location: "Greenville, SC",
        description:
          "A historic 1925 hotel in the heart of downtown Greenville with a grand ballroom and classic architecture — a prestige room that rewards a setlist built for an elevated crowd.",
      },
      {
        name: "The Old Cigar Warehouse",
        location: "Greenville, SC",
        description:
          "A converted 1900s industrial building with exposed brick, timber beams, and a high open ceiling — the room has presence and warmth, and a dance floor that holds energy well.",
      },
      {
        name: "The Larkin",
        location: "Greenville, SC",
        description:
          "A contemporary venue in the West End district with open floor plans and city views — clean acoustics in a modern space with excellent speaker placement flexibility.",
      },
      {
        name: "Falls Park on the Reedy",
        location: "Greenville, SC",
        description:
          "An iconic outdoor venue centered on the Liberty Bridge over the Reedy River falls — outdoor sound here requires careful speaker positioning and volume discipline near residential areas.",
      },
      {
        name: "Vineyard at Ivy Creek",
        location: "Greer, SC",
        description:
          "A Tuscan-inspired vineyard venue with mountain views and indoor/outdoor flexibility — a warm, welcoming space where the music should feel like it belongs to the landscape.",
      },
      {
        name: "Swamp Rabbit Inn",
        location: "Travelers Rest, SC",
        description:
          "A boutique inn near the Swamp Rabbit Trail with a relaxed, curated aesthetic — intimate event spaces that call for measured, unhurried music choices.",
      },
      {
        name: "The Loft at Soby's",
        location: "Greenville, SC",
        description:
          "An intimate dining and event loft above one of Greenville's most respected restaurants — small room dynamics require precise volume control and a setlist that complements conversation.",
      },
    ],
    nearbyAreas: [
      "Spartanburg",
      "Greer",
      "Simpsonville",
      "Mauldin",
      "Travelers Rest",
      "Easley",
      "Anderson",
    ],
    faq: [
      {
        question: "How far is Greenville, SC from Asheville?",
        answer:
          "About two hours. Travel fees apply for distances beyond 60 miles and are included in your quote. Greenville is within my regular service range.",
      },
      {
        question: "What makes your approach different for Greenville's sophisticated crowd?",
        answer:
          "Greenville couples tend to have strong musical opinions and high expectations. I match that by building the setlist collaboratively in advance and then executing with real-time reading of the crowd. No defaults, no filler.",
      },
      {
        question: "Do you bring your own sound system or use the venue's?",
        answer:
          "I always bring my own professional rig — I don't rely on house systems, which vary widely in quality and configuration. My setup is scaled to the room size and dialed specifically for your event.",
      },
    ],
  },

  hendersonville: {
    city: "Hendersonville",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "hendersonville",
    heroTagline:
      "Apple orchards, mountain estates, and a crowd that knows how to celebrate — Hendersonville weddings earn every note.",
    introParagraph:
      "Hendersonville is 25 miles from Asheville and has become one of the most active wedding markets in Western North Carolina. The venues here — farms, estates, vineyard ridges, and country inns — attract couples who want the mountain experience with a pastoral character. I work this area regularly and know many of the venues well. The crowd here tends to be warm, family-oriented, and ready to celebrate — the music needs to honor that without overdoing it.",
    regionDescription:
      "Henderson County sits in a broad valley between two mountain ridges and has a gentler, more pastoral character than Asheville. It's known for apple orchards, historic Flat Rock, the Flat Rock Playhouse, and a thriving arts community. Wedding venues here range from working farms to lakeside properties to converted barns.",
    venues: [
      {
        name: "Jeter Mountain Farm",
        location: "Hendersonville, NC",
        description:
          "A 411-acre working farm with 11,000 sq ft of dedicated event space — the massive barn has excellent natural acoustics and a dance floor that holds a large crowd.",
      },
      {
        name: "The Horse Shoe Farm",
        location: "Horse Shoe, NC",
        description:
          "An 85-acre boutique resort along the French Broad River with a Sunset Barn — the loft-style layout creates energy naturally, and I position speakers to cover both levels cleanly.",
      },
      {
        name: "Burntshirt Vineyards",
        location: "Hendersonville, NC",
        description:
          "A Blue Ridge vineyard with panoramic mountain views and a covered pavilion — outdoor reception settings here benefit from directional speaker arrays aimed at the dance floor.",
      },
      {
        name: "Colvard Farms",
        location: "Mills River, NC",
        description:
          "An upscale farm venue with mountain views and a main barn that has excellent acoustics — a dance floor that energizes quickly once the setlist builds.",
      },
      {
        name: "The Stoney Creek",
        location: "Hendersonville, NC",
        description:
          "A creek-side venue with rustic outdoor ceremony spaces and an intimate indoor reception area — soft natural materials in the room keep music sounding warm and contained.",
      },
      {
        name: "Flat Rock Inn",
        location: "Flat Rock, NC",
        description:
          "A historic 1888 inn in the heart of Flat Rock with intimate gardens and indoor event space — small-scale rooms where precise volume management is essential.",
      },
      {
        name: "Sky Top Orchard",
        location: "Flat Rock, NC",
        description:
          "A mountain apple orchard with outdoor event space and sweeping views — a unique open-air setting where I bring full portable coverage for clarity across the grounds.",
      },
    ],
    nearbyAreas: [
      "Flat Rock",
      "Mills River",
      "Horse Shoe",
      "Brevard",
      "Asheville",
      "Saluda",
      "Tryon",
    ],
    faq: [
      {
        question: "Is Hendersonville within your standard service area?",
        answer:
          "Yes. Hendersonville is 25 miles from Asheville and falls within my no-travel-fee zone. I work in Henderson County regularly.",
      },
      {
        question: "What types of music work best for Hendersonville-area weddings?",
        answer:
          "The crowds here tend to be multigenerational with strong family presence. I anchor the early reception in classics — Motown, soul, classic rock — and build toward contemporary as the night progresses. The key is never losing the older guests before 9pm.",
      },
      {
        question: "How do you handle outdoor receptions that move inside during the event?",
        answer:
          "I pre-plan for both configurations and bring equipment to cover both spaces. If weather or timing shifts the event indoors, I adjust within minutes — not an hour.",
      },
    ],
  },

  highlands: {
    city: "Highlands",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "highlands",
    heroTagline:
      "At 4,000 feet, Highlands weddings have a quiet intensity. The music should earn its place in that room.",
    introParagraph:
      "Highlands is one of the most exclusive wedding destinations in the Southeast — a mountain plateau at 4,118 feet with a small-town scale and a genuine luxury character. Couples who marry here are not looking for spectacle; they're looking for refinement. The venues are extraordinary, the guests are discerning, and the music has to justify its presence. I take a limited number of Highlands bookings each year and approach each one as an exercise in precision and restraint.",
    regionDescription:
      "Macon County's Highlands Plateau sits on the North Carolina-Georgia border at over 4,000 feet elevation. The area draws affluent couples from Atlanta, Charlotte, and beyond who want destination-wedding quality in an intimate mountain setting. Cashiers, just 11 miles away, adds another layer of luxury estate venues to the region.",
    venues: [
      {
        name: "Old Edwards Inn and Spa",
        location: "Highlands, NC",
        description:
          "A Forbes Four-Star mountain resort with refined event spaces including a stone terrace and intimate ballroom — a prestige room where music must be polished, never loud.",
      },
      {
        name: "The Farm at Old Edwards",
        location: "Highlands, NC",
        description:
          "A restored early-1900s farm barn on the Old Edwards campus with a stone fireplace and antique beams — the interior absorbs sound beautifully and rewards a warm, natural mix.",
      },
      {
        name: "Skyline Lodge",
        location: "Highlands, NC",
        description:
          "A boutique mountain inn with sweeping views from the Highlands Plateau — intimate event spaces where music is felt as much as heard.",
      },
      {
        name: "The Bascom",
        location: "Highlands, NC",
        description:
          "A contemporary art center with flexible event spaces and a sophisticated crowd — clean acoustics and a guest profile that expects careful curation.",
      },
      {
        name: "High Hampton Resort",
        location: "Cashiers, NC",
        description:
          "A historic mountain resort on 1,400 acres that has hosted weddings for generations — the main lodge ballroom has a warm, established feel that anchors the night.",
      },
      {
        name: "Sapphire Valley Resort",
        location: "Sapphire, NC",
        description:
          "A full-service mountain resort with lakeside event spaces and mountain views — the outdoor lakeside setup benefits from careful speaker positioning to manage lake reflection.",
      },
      {
        name: "Trillium Ridge",
        location: "Cashiers, NC",
        description:
          "A private estate community with a refined clubhouse and mountain views — exclusive venue where the music should feel personal and intentional.",
      },
    ],
    nearbyAreas: [
      "Cashiers",
      "Sapphire",
      "Glenville",
      "Scaly Mountain",
      "Dillard, GA",
      "Clayton, GA",
      "Franklin, NC",
    ],
    faq: [
      {
        question: "Do you travel to Highlands from Asheville?",
        answer:
          "Yes. Highlands is about 70 miles from Asheville — a scenic drive through Nantahala forest. Travel fees apply and are included in your quote.",
      },
      {
        question: "How do you approach music for a luxury Highlands wedding?",
        answer:
          "Restraint is everything in this market. Loud is not the goal. The goal is impeccable timing, seamless transitions, and a setlist that feels curated rather than assembled. I've worked with couples who wanted jazz and Sinatra all night, and couples who wanted hip-hop at 10pm — both are right if they fit the room.",
      },
      {
        question: "How far in advance should I book for a Highlands or Cashiers wedding?",
        answer:
          "Old Edwards and High Hampton book out 12–18 months, sometimes more. If you have a date and a venue in Highlands or Cashiers, reach out immediately.",
      },
    ],
  },

  "johnson-city": {
    city: "Johnson City",
    state: "Tennessee",
    stateAbbr: "TN",
    slug: "johnson-city",
    heroTagline:
      "The Tri-Cities region has its own wedding character — Appalachian roots, mountain backdrops, and a crowd that knows good music.",
    introParagraph:
      "Johnson City sits in northeast Tennessee, about two hours from Asheville, and has a genuine mountain character distinct from both Knoxville and Asheville. The wedding venues here range from historic downtown buildings to working farms in the Nolichucky River valley. I take Tri-Cities bookings for couples who want someone who brings a clear point of view to their wedding music — not just a service.",
    regionDescription:
      "The Tri-Cities — Johnson City, Kingsport, and Bristol — sit where North Carolina, Tennessee, and Virginia converge. The region has a proud Appalachian heritage and a wedding culture that values community, family, and celebration done right. East Tennessee State University gives Johnson City a younger cultural edge alongside its traditional roots.",
    venues: [
      {
        name: "The Carnegie Hotel",
        location: "Johnson City, TN",
        description:
          "A historic boutique hotel with refined event spaces and a sophisticated downtown presence — a well-maintained room with good acoustics and a crowd that expects polish.",
      },
      {
        name: "Ridgewood Event Center",
        location: "Johnson City, TN",
        description:
          "A dedicated event center with a spacious ballroom and professional setup infrastructure — a clean room with flexible speaker placement options.",
      },
      {
        name: "Boone Street Market",
        location: "Johnson City, TN",
        description:
          "A renovated historic market building with an urban-chic interior and exposed brick — the room has character and the acoustics are warmer than the industrial look suggests.",
      },
      {
        name: "The Tipton House",
        location: "Johnson City, TN",
        description:
          "A historic estate venue with period architecture and garden ceremony spaces — intimate in scale with a room that rewards careful volume management.",
      },
      {
        name: "Ellington's at Olde Towne",
        location: "Kingsport, TN",
        description:
          "A downtown Kingsport venue in a restored historic building with high ceilings and an energetic interior — a space that builds atmosphere quickly.",
      },
      {
        name: "Rocky Mount Museum",
        location: "Piney Flats, TN",
        description:
          "An outdoor living history museum set in a historic farm compound — open-air settings with natural background character that shapes the entire music approach.",
      },
    ],
    nearbyAreas: [
      "Kingsport",
      "Bristol",
      "Elizabethton",
      "Gray",
      "Jonesborough",
      "Erwin, TN",
      "Mountain City, TN",
    ],
    faq: [
      {
        question: "Do you travel to Johnson City from Asheville?",
        answer:
          "Yes. Johnson City is about two hours from Asheville. Travel fees apply and are clearly stated in your quote. I take a limited number of Tri-Cities bookings each year.",
      },
      {
        question: "What music styles work well for Tri-Cities wedding crowds?",
        answer:
          "Northeast Tennessee crowds respond well to classic country, Southern rock, Motown, and a carefully built contemporary mix. The key is reading when to lean into regional taste and when to push the energy forward — that's judgment developed through experience, not a preset.",
      },
      {
        question: "Do you bring all your own equipment to Tri-Cities venues?",
        answer:
          "Always. I don't rely on venue-provided sound. My full rig travels with me, scaled to the specific room.",
      },
    ],
  },

  knoxville: {
    city: "Knoxville",
    state: "Tennessee",
    stateAbbr: "TN",
    slug: "knoxville",
    heroTagline:
      "Knoxville weddings sit at the intersection of Southern tradition and Tennessee energy. Getting the music right matters here.",
    introParagraph:
      "Knoxville is about two hours from Asheville and one of the most interesting wedding markets in the region. The city has genuine urban energy, a thriving food and arts scene, and proximity to the Smoky Mountains that means venues range from downtown lofts to lakeside properties to mountain retreats just 45 minutes away. I take Knoxville bookings for couples who want a DJ with range — someone who can move from Sinatra during cocktails to hip-hop at midnight and make both feel inevitable.",
    regionDescription:
      "Knox County and the surrounding Knoxville metro draw couples from across East Tennessee and beyond. The University of Tennessee gives the city a young, energetic undercurrent, while the surrounding lake and mountain communities attract a more destination-minded crowd. The wedding market here has strong expectations and benefits from a DJ who brings a defined point of view.",
    venues: [
      {
        name: "The Tennessean Personal Luxury Hotel",
        location: "Knoxville, TN",
        description:
          "A Forbes-rated boutique hotel on Gay Street with sophisticated event spaces and a crowd that expects meticulous execution.",
      },
      {
        name: "Rothchild's Catering and Conference Center",
        location: "Knoxville, TN",
        description:
          "One of Knoxville's most-booked wedding venues with a large ballroom and professional setup — the room has clean sightlines from DJ position and a well-sized dance floor.",
      },
      {
        name: "The Jackson Terminal",
        location: "Knoxville, TN",
        description:
          "A converted 1906 freight terminal with soaring ceilings and industrial character — large volume space that benefits from a full speaker rig with delay fills.",
      },
      {
        name: "Maple Hall",
        location: "Knoxville, TN",
        description:
          "A boutique hotel and event venue in downtown Knoxville with a rooftop and refined interior spaces — multiple room configurations that require separate acoustic approaches.",
      },
      {
        name: "Whitestone Country Inn",
        location: "Kingston, TN",
        description:
          "A lakefront country inn on Watts Bar Lake with stunning outdoor ceremony sites — lake-edge outdoor sound requires careful speaker placement to avoid carrying across the water.",
      },
      {
        name: "Harborview Events at Concord Marina",
        location: "Knoxville, TN",
        description:
          "A waterfront venue on Fort Loudoun Lake with indoor and outdoor configurations — the lake breeze means outdoor sound dissipates quickly, so I compensate with directed coverage.",
      },
    ],
    nearbyAreas: [
      "Maryville",
      "Oak Ridge",
      "Sevierville",
      "Farragut",
      "Powell",
      "Alcoa",
      "Lenoir City",
    ],
    faq: [
      {
        question: "How far is Knoxville from Asheville?",
        answer:
          "About two hours via I-40. Travel fees apply beyond 60 miles. Knoxville is a market I take selectively — reach out early if your date is peak season.",
      },
      {
        question: "What sound system do you use for large Knoxville venues?",
        answer:
          "For larger rooms like The Jackson Terminal or Rothchild's main ballroom, I run a professional line-array or high-powered point-source system scaled to the room. I always bring more than I need and trim it down based on actual acoustic conditions on the day.",
      },
      {
        question: "Can you perform at indoor and outdoor portions of the same wedding?",
        answer:
          "Yes. I run separate systems for separate spaces when needed and transition between them cleanly. Multi-location weddings require more planning, which happens in our pre-event meetings.",
      },
    ],
  },

  "lake-lure": {
    city: "Lake Lure",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "lake-lure",
    heroTagline:
      "A mountain lake with decades of wedding history. The music on that dance floor should be worth the drive.",
    introParagraph:
      "Lake Lure is one of the most romantic wedding destinations in the Carolinas — a man-made lake surrounded by Chimney Rock and the Blue Ridge foothills, about 45 miles from Asheville. The couples who choose Lake Lure know the history, know the views, and have usually seen photos from the inn stretching back decades. I bring the same care to these events that the lake itself demands — unhurried, intentional, and built for the moment.",
    regionDescription:
      "Rutherford County and the Lake Lure area combine lakeside beauty with mountain character in a way that's rare in the Southeast. The town is small and the venues are limited, which means every wedding here feels more exclusive. The Chimney Rock corridor draws couples who want a dramatic natural backdrop without the crowds of Asheville.",
    venues: [
      {
        name: "Lake Lure Inn & Spa",
        location: "Lake Lure, NC",
        description:
          "A historic 1927 lakefront inn where Dirty Dancing was filmed — the main ballroom overlooks the lake and has a classic warmth that suits both big-band standards and contemporary reception music.",
      },
      {
        name: "Rumbling Bald on Lake Lure",
        location: "Lake Lure, NC",
        description:
          "A full-service lakeside resort with a beachside ceremony gazebo and panoramic mountain views — outdoor lake-edge sound requires deliberate speaker positioning, and the indoor reception space has clean acoustics.",
      },
      {
        name: "Washburn Chapel",
        location: "Lake Lure, NC",
        description:
          "A white-steepled chapel right at the lakefront — one of the most photographed ceremony venues in the region, with intimate acoustics suited to live-style ceremony sound.",
      },
      {
        name: "Camp Pinewood",
        location: "Lake Lure, NC",
        description:
          "A wooded camp-style venue on Lake Lure with an open-air pavilion — relaxed atmosphere where the music should feel organic and the volume should respect the natural setting.",
      },
      {
        name: "The Lodge at Lake Lure",
        location: "Lake Lure, NC",
        description:
          "A lakefront lodge with indoor and outdoor event spaces overlooking the water — the lake setting means sound carries across the surface, so I keep outdoor levels deliberate.",
      },
    ],
    nearbyAreas: [
      "Chimney Rock",
      "Rutherfordton",
      "Hendersonville",
      "Saluda",
      "Bostic",
      "Marion, NC",
      "Asheville",
    ],
    faq: [
      {
        question: "Is Lake Lure within your standard service area?",
        answer:
          "Yes. Lake Lure is about 45 miles from Asheville — within my standard service area with no additional travel fee.",
      },
      {
        question: "Have you worked at the Lake Lure Inn before?",
        answer:
          "Yes. I'm familiar with the main ballroom, the veranda, and the outdoor lakeside spaces. Even at familiar venues I arrive early and walk the full setup before guests arrive.",
      },
      {
        question: "How do you handle outdoor lake venues where sound carries across the water?",
        answer:
          "Lake environments are tricky — sound travels across water in ways that can push volume onto the opposite shoreline. I use directional speaker positioning, keep outdoor levels conservative, and bring the main energy into the indoor reception space.",
      },
    ],
  },

  spartanburg: {
    city: "Spartanburg",
    state: "South Carolina",
    stateAbbr: "SC",
    slug: "spartanburg",
    heroTagline:
      "Spartanburg has more going on than most people expect. The wedding scene reflects that.",
    introParagraph:
      "Spartanburg is about two hours from Asheville and has a genuinely underrated wedding market — historic downtown buildings, estates in the surrounding countryside, and a couple of genuinely excellent venues that don't get the press they deserve. The crowds here are loyal, family-focused, and ready to celebrate. I take Upstate SC bookings for couples who want intentional music curation from someone who's actually paying attention.",
    regionDescription:
      "Spartanburg County sits at the western edge of the South Carolina Upstate, close to the North Carolina and Georgia borders. The region has a strong manufacturing and arts heritage and a growing downtown that attracts younger couples alongside the more traditional estate-venue crowd.",
    venues: [
      {
        name: "Spartanburg Marriott",
        location: "Spartanburg, SC",
        description:
          "A full-service hotel ballroom in downtown Spartanburg with professional AV infrastructure — a reliable, large-room setup with good sightlines from the DJ position.",
      },
      {
        name: "The Pavilion at Milliken",
        location: "Spartanburg, SC",
        description:
          "A striking glass-and-steel pavilion on the Milliken corporate campus with botanical garden surroundings — clean acoustics in a modern structure with excellent speaker placement flexibility.",
      },
      {
        name: "The Hatcher Garden and Woodland Preserve",
        location: "Spartanburg, SC",
        description:
          "A botanical garden venue with multiple outdoor settings — open-air configurations across the grounds that benefit from portable directional speaker coverage.",
      },
      {
        name: "Walnut Grove Plantation",
        location: "Roebuck, SC",
        description:
          "A 1765 historic plantation house and grounds — one of the oldest event venues in the Upstate, with outdoor ceremony spaces and a garden setting steeped in history.",
      },
      {
        name: "The Larkin's on the Lake",
        location: "Greer, SC",
        description:
          "A lakefront restaurant and event venue between Spartanburg and Greenville — intimate indoor dining room and outdoor lakeside space that requires careful outdoor sound management.",
      },
      {
        name: "The Country Club of Spartanburg",
        location: "Spartanburg, SC",
        description:
          "A traditional country club ballroom with a classic setup — the room holds a crowd well and the dance floor is proportional to the space.",
      },
    ],
    nearbyAreas: [
      "Greenville",
      "Greer",
      "Duncan",
      "Inman",
      "Gaffney",
      "Chesnee",
      "Cherokee County",
    ],
    faq: [
      {
        question: "Do you travel to Spartanburg from Asheville?",
        answer:
          "Yes. Spartanburg is about two hours from Asheville. Travel fees apply beyond 60 miles and are clearly detailed in your quote.",
      },
      {
        question: "What is your booking availability for Upstate SC?",
        answer:
          "I take a limited number of out-of-market bookings per year. Spartanburg and Greenville-area dates fill up in the spring and fall. Reach out as soon as your date is set.",
      },
      {
        question: "How do you coordinate with other vendors for a Spartanburg wedding?",
        answer:
          "I reach out to your venue coordinator and other vendors 2–3 weeks before the event to align on timeline, logistics, and any audio-sharing needs. Day-of, I arrive early and walk the full setup before the first guest arrives.",
      },
    ],
  },

  waynesville: {
    city: "Waynesville",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "waynesville",
    heroTagline:
      "Waynesville sits in the Great Smoky Mountains foothills with a quiet dignity that the music should match.",
    introParagraph:
      "Waynesville is about 30 miles west of Asheville and has a character all its own — a historic Main Street, strong arts community, and proximity to the Blue Ridge Parkway and Great Smoky Mountains. The wedding venues here range from country clubs with mountain golf course views to intimate farm properties tucked into Haywood County's hollows. I work this area regularly and know the rooms well.",
    regionDescription:
      "Haywood County is the westernmost county served from Asheville with significant wedding activity. Waynesville anchors the region with its arts district and Main Street, while the surrounding countryside has farms, mountain estates, and properties that back up to national forest land. The crowd here tends to be relaxed and community-oriented.",
    venues: [
      {
        name: "Laurel Ridge Country Club",
        location: "Waynesville, NC",
        description:
          "A private country club with a ballroom overlooking a mountain golf course — the room has clean acoustics and a dance floor that's proportional for mid-sized weddings.",
      },
      {
        name: "Maggie Valley Club",
        location: "Maggie Valley, NC",
        description:
          "A mountain golf and country club with event spaces and sweeping valley views — a traditional room with reliable setup and a crowd that spans multiple generations.",
      },
      {
        name: "The Swag",
        location: "Waynesville, NC",
        description:
          "An ultra-exclusive mountain inn on the crest of the Smokies at 5,000 feet — intimate spaces where acoustic precision matters more than volume.",
      },
      {
        name: "Cataloochee Ranch",
        location: "Maggie Valley, NC",
        description:
          "A historic mountain ranch at 5,000 feet with panoramic views of the Smokies — outdoor ceremony spaces where sound management in open mountain air requires careful advance planning.",
      },
      {
        name: "The Balsam Mountain Inn",
        location: "Balsam, NC",
        description:
          "A Victorian inn at the foot of the Balsam Mountains along the historic train line — period character and intimate acoustics that suit a quieter, more personal reception.",
      },
      {
        name: "Lauada Farms",
        location: "Waynesville, NC",
        description:
          "A farm venue in the Haywood County countryside with a barn and pastoral grounds — warm natural materials and an outdoor ceremony site with good natural acoustic conditions.",
      },
    ],
    nearbyAreas: [
      "Maggie Valley",
      "Clyde",
      "Canton",
      "Sylva",
      "Dillsboro",
      "Bryson City",
      "Asheville",
    ],
    faq: [
      {
        question: "Is Waynesville within your standard service area?",
        answer:
          "Yes. Waynesville is about 30 miles from Asheville — well within my standard service area with no travel fee.",
      },
      {
        question: "What's the musical culture like at Waynesville and Haywood County weddings?",
        answer:
          "Haywood County crowds tend to be rooted in Western NC culture — Appalachian music, classic country, and classic rock are always in the mix alongside contemporary. I read what the specific crowd is bringing to the room that night and build from there.",
      },
      {
        question: "Have you worked at high-elevation venues like The Swag or Cataloochee Ranch?",
        answer:
          "I've worked at high-elevation mountain venues with limited load-in access and know how to plan accordingly. I scout any new venue in advance and arrive with enough time to handle whatever logistics the location presents.",
      },
    ],
  },

  "winston-salem": {
    city: "Winston-Salem",
    state: "North Carolina",
    stateAbbr: "NC",
    slug: "winston-salem",
    heroTagline:
      "Winston-Salem is one of North Carolina's most culturally rich cities. The wedding music should reflect that.",
    introParagraph:
      "Winston-Salem sits about three hours from Asheville and has a cultural depth that most outsiders underestimate — from the SECCA and Reynolda House to the Piedmont arts scene and the Wake Forest University community. Couples who marry here often have strong aesthetic opinions and a clear sense of what they want their night to feel like. I take Winston-Salem bookings for people who want a DJ who can execute that vision, not just show up.",
    regionDescription:
      "Forsyth County's Winston-Salem is the anchor of the western Piedmont Triad — a city with manufacturing roots that has reinvented itself around arts, medicine, and education. The wedding market here draws from the Wake Forest community, the surrounding countryside, and a significant destination-event segment from Charlotte and the Research Triangle.",
    venues: [
      {
        name: "Reynolda House Museum of American Art",
        location: "Winston-Salem, NC",
        description:
          "A 1917 Prairie-style estate home on 170 acres — intimate event spaces in a museum setting where music volume must be precise and the curation must be impeccable.",
      },
      {
        name: "Graylyn International Conference Center",
        location: "Winston-Salem, NC",
        description:
          "A Norman Revival estate on the Wake Forest campus with formal event rooms — grand interiors with high ceilings and hard surfaces that require careful gain staging to avoid buildup.",
      },
      {
        name: "The Millennium Center",
        location: "Winston-Salem, NC",
        description:
          "A grand downtown event center in a restored Masonic temple — ornate interiors and a ballroom that holds large crowds with a professional in-house AV foundation.",
      },
      {
        name: "The Barn at Valhalla",
        location: "Winston-Salem, NC",
        description:
          "A restored barn venue with a refined rustic aesthetic — warm natural materials that absorb sound well and a dance floor that energizes easily.",
      },
      {
        name: "Forsyth Country Club",
        location: "Winston-Salem, NC",
        description:
          "A traditional country club ballroom with classic setup and reliable acoustics — the room fills predictably and the dance floor sits at the right distance from the speaker position.",
      },
      {
        name: "The Sutton House",
        location: "Winston-Salem, NC",
        description:
          "A historic Victorian estate venue with garden ceremony spaces and intimate indoor reception rooms — small-scale dynamics where music feels personal and precise.",
      },
      {
        name: "White Oak Estates",
        location: "Advance, NC",
        description:
          "A farm-style event venue in the Forsyth County countryside with indoor and outdoor ceremony options — the barn has warm acoustics and an outdoor space that benefits from directional coverage.",
      },
    ],
    nearbyAreas: [
      "Greensboro",
      "High Point",
      "Kernersville",
      "Clemmons",
      "Lewisville",
      "Advance",
      "Mocksville",
    ],
    faq: [
      {
        question: "Do you travel to Winston-Salem from Asheville?",
        answer:
          "Yes. Winston-Salem is about three hours from Asheville. Travel fees apply for distances beyond 60 miles and are itemized in your quote. I take a limited number of Triad bookings per year.",
      },
      {
        question: "What is the tamada tradition and how does it apply to my wedding?",
        answer:
          "The tamada is the traditional Slavic wedding host — the person who guides the night's emotional arc, toasts the couple, unites families who may not know each other, and makes sure the celebration builds toward something unforgettable. It's not a DJ who announces the next event. It's someone who holds the room together from the first song to the last. That's what I bring to every wedding, regardless of where it is.",
      },
      {
        question: "How do I know if you're the right DJ for my Winston-Salem wedding?",
        answer:
          "Read the reviews. Talk to me for 20 minutes. If you want great music taste, someone who doesn't need hand-holding, and a night your guests will talk about for years — I'm the right fit. If you want to micromanage every song, I'm probably not.",
      },
    ],
  },
};
