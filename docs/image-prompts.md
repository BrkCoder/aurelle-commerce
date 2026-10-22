# Aurelle: Product Image Prompts

Prompts for generating realistic product photography for the 30 seeded products, three views each. Generate the images yourself (Gemini or any image tool), drop them in the folder layout below, and they can be wired into the seed in one step.

> Generated from `app/db/seed/catalogue-data.ts`. If the seed changes, regenerate rather than editing by hand.

## Output spec

- **Aspect ratio 4:5 portrait.** Generate at 1600 × 2000 or larger; we downscale to 800 × 1000 and ship AVIF/WebP.
- **File layout:** `incoming-images/<slug>/1.png`, `2.png`, `3.png` (view 1 = front, 2 = detail, 3 = styled). PNG or JPG both fine.
- **One metal per piece**, the one named below. Other metals are offered as variants but are not photographed yet.
- Keep the same lighting and backdrop across all 90 images so the catalogue reads as one shoot.

## Shared style block

Paste this at the end of every prompt:

```text
Luxury jewellery e-commerce photograph, editorial and minimal. Soft diffused daylight from the upper left, gentle natural shadow, warm neutral colour grade. Backdrop: warm ivory (#FAF7F2) fading to pale sand (#E8DFD2), subtle paper-like texture. Razor-sharp focus on the piece, true-to-life metal and gemstone reflections, realistic facets and hallmark-quality finishing. Vertical 4:5 composition with generous empty space around the subject. No text, no logos, no watermark, no brand names, no people, no hands, no mannequins, no extra jewellery, no props except where stated.
```

## View templates

| View      | Template                                                                                                                                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1: front  | `[SUBJECT]. Centred, straight-on hero product shot, the piece occupying about 55% of the frame height, resting naturally (rings standing upright, necklaces and bracelets arranged in a soft arc, earrings as a mirrored pair).` |
| 2: detail | `[SUBJECT]. Macro close-up of [FOCUS], extreme sharpness on the gemstone or metal edge, shallow depth of field, the piece cropped by the frame.`                                                                                 |
| 3: styled | `[SUBJECT]. Placed on a low plinth of pale travertine stone beside a loosely folded piece of ivory linen, the piece occupying about 35% of the frame, soft window light casting a long gentle shadow.`                           |

## Products

| #   | Slug                           | Category  | Metal       |
| --- | ------------------------------ | --------- | ----------- |
| 1   | `lumiere-solitaire-ring`       | rings     | yellow-gold |
| 2   | `etoile-halo-ring`             | rings     | yellow-gold |
| 3   | `aube-eternity-band`           | rings     | yellow-gold |
| 4   | `vesper-trilogy-ring`          | rings     | yellow-gold |
| 5   | `marais-band-ring`             | rings     | yellow-gold |
| 6   | `seraphine-twist-ring`         | rings     | yellow-gold |
| 7   | `opaline-signet-ring`          | rings     | yellow-gold |
| 8   | `cassis-emerald-ring`          | rings     | yellow-gold |
| 9   | `noor-sapphire-cocktail-ring`  | rings     | white-gold  |
| 10  | `celeste-pendant-necklace`     | necklaces | white-gold  |
| 11  | `lune-crescent-pendant`        | necklaces | yellow-gold |
| 12  | `vesper-chain-necklace`        | necklaces | yellow-gold |
| 13  | `aurelia-pearl-pendant`        | necklaces | yellow-gold |
| 14  | `perle-riviere-necklace`       | necklaces | yellow-gold |
| 15  | `soleil-medallion-necklace`    | necklaces | yellow-gold |
| 16  | `marguerite-locket-necklace`   | necklaces | yellow-gold |
| 17  | `isolde-diamond-riviere`       | necklaces | white-gold  |
| 18  | `opale-sculpted-bangle`        | bracelets | yellow-gold |
| 19  | `perle-tennis-bracelet`        | bracelets | white-gold  |
| 20  | `calliope-chain-bracelet`      | bracelets | yellow-gold |
| 21  | `diane-cuff-bracelet`          | bracelets | yellow-gold |
| 22  | `sorel-charm-bracelet`         | bracelets | yellow-gold |
| 23  | `linnea-pearl-bracelet`        | bracelets | yellow-gold |
| 24  | `orion-link-bracelet`          | bracelets | yellow-gold |
| 25  | `aurore-pearl-drop-earrings`   | earrings  | yellow-gold |
| 26  | `soleil-stud-earrings`         | earrings  | yellow-gold |
| 27  | `camille-hoop-earrings`        | earrings  | yellow-gold |
| 28  | `rosalind-chandelier-earrings` | earrings  | white-gold  |
| 29  | `mireille-huggie-earrings`     | earrings  | yellow-gold |
| 30  | `ondine-threader-earrings`     | earrings  | yellow-gold |

Each section gives the `[SUBJECT]` and `[FOCUS]` to substitute into the templates.

### 1. Lumière Solitaire Ring

- Folder: `incoming-images/lumiere-solitaire-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, set with 0.50 ct brilliant-cut diamond. A single brilliant-cut diamond held by six slender claws on a softly rounded band. Dimensions: band 1.8 mm
- `[FOCUS]`: the setting, claws and the curve of the band, with the gemstone as the hero

### 2. Étoile Halo Ring

- Folder: `incoming-images/etoile-halo-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, set with 0.35 ct diamond, pavé halo. A diamond ringed by a halo of pavé stones that throws light in every direction. Dimensions: band 1.6 mm, halo 8 mm
- `[FOCUS]`: the setting, claws and the curve of the band, with the gemstone as the hero

### 3. Aube Eternity Band

- Folder: `incoming-images/aube-eternity-band/`
- `[SUBJECT]`: A polished 18k yellow gold ring, set with round brilliant diamonds, 0.90 ct total. A continuous line of matched diamonds, set low so it sits flush against a solitaire. Dimensions: band 2.2 mm
- `[FOCUS]`: the setting, claws and the curve of the band, with the gemstone as the hero

### 4. Vesper Trilogy Ring

- Folder: `incoming-images/vesper-trilogy-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, set with three diamonds, 0.75 ct total. Past, present and future in three graduated diamonds on a tapering band. Dimensions: band 2.0 mm
- `[FOCUS]`: the setting, claws and the curve of the band, with the gemstone as the hero

### 5. Marais Band Ring

- Folder: `incoming-images/marais-band-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, with no gemstones. A clean, domed band made to stack with others or stand quietly alone. Dimensions: band 3.0 mm
- `[FOCUS]`: the setting, claws and the curve of the band

### 6. Séraphine Twist Ring

- Folder: `incoming-images/seraphine-twist-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, with no gemstones. Two strands of polished gold twisted into a single, supple ring. Dimensions: band 3.5 mm
- `[FOCUS]`: the setting, claws and the curve of the band

### 7. Opaline Signet Ring

- Folder: `incoming-images/opaline-signet-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, with no gemstones. An oval signet with a mirror-polished face, ready for a monogram. Dimensions: face 12 × 10 mm
- `[FOCUS]`: the setting, claws and the curve of the band

### 8. Cassis Emerald Ring

- Folder: `incoming-images/cassis-emerald-ring/`
- `[SUBJECT]`: A polished 18k yellow gold ring, set with 1.1 ct emerald, diamond shoulders. A deep green emerald framed by diamond shoulders in a collet setting. Dimensions: stone 7 × 5 mm
- `[FOCUS]`: the setting, claws and the curve of the band, with the gemstone as the hero

### 9. Noor Sapphire Cocktail Ring

- Folder: `incoming-images/noor-sapphire-cocktail-ring/`
- `[SUBJECT]`: A polished 18k white gold ring, set with 2.0 ct cushion sapphire. A cushion-cut sapphire the colour of late-evening sky, surrounded by diamonds. Dimensions: stone 8 mm
- `[FOCUS]`: the setting, claws and the curve of the band, with the gemstone as the hero

### 10. Céleste Pendant Necklace

- Folder: `incoming-images/celeste-pendant-necklace/`
- `[SUBJECT]`: A polished 18k white gold necklace, set with 0.80 ct pale sapphire. A pale sapphire suspended on a fine, hand-finished trace chain. Dimensions: pendant 6 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain, with the gemstone as the hero

### 11. Lune Crescent Pendant

- Folder: `incoming-images/lune-crescent-pendant/`
- `[SUBJECT]`: A polished 18k yellow gold necklace, set with pavé diamonds. A slim crescent of gold, edged with diamonds along its inner curve. Dimensions: pendant 14 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain, with the gemstone as the hero

### 12. Vesper Chain Necklace

- Folder: `incoming-images/vesper-chain-necklace/`
- `[SUBJECT]`: A polished 18k yellow gold necklace, with no gemstones. A weighty, polished curb chain for everyday layering. Dimensions: link 4 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain

### 13. Aurelia Pearl Pendant

- Folder: `incoming-images/aurelia-pearl-pendant/`
- `[SUBJECT]`: A polished 18k yellow gold necklace, set with 9 mm freshwater pearl. A single lustrous pearl floating on a whisper-thin chain. Dimensions: pearl 9 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain, with the gemstone as the hero

### 14. Perle Rivière Necklace

- Folder: `incoming-images/perle-riviere-necklace/`
- `[SUBJECT]`: A polished 18k yellow gold necklace, set with graduated freshwater pearls. Graduated pearls knotted by hand on silk, finished with a gold clasp. Dimensions: pearls 5-8 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain, with the gemstone as the hero

### 15. Soleil Medallion Necklace

- Folder: `incoming-images/soleil-medallion-necklace/`
- `[SUBJECT]`: A polished 18k yellow gold necklace, with no gemstones. A hand-engraved sunburst medallion on a rolo chain. Dimensions: medallion 18 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain

### 16. Marguerite Locket Necklace

- Folder: `incoming-images/marguerite-locket-necklace/`
- `[SUBJECT]`: A polished 18k yellow gold necklace, with no gemstones. A hinged locket engraved with a single flower, large enough to hold two small portraits. Dimensions: locket 20 × 16 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain

### 17. Isolde Diamond Rivière

- Folder: `incoming-images/isolde-diamond-riviere/`
- `[SUBJECT]`: A polished 18k white gold necklace, set with graduated diamonds, 3.2 ct total. A flowing line of graduated diamonds, each set in its own tiny collet. Dimensions: stones 2-4 mm
- `[FOCUS]`: the pendant or focal link and a few links of the chain, with the gemstone as the hero

### 18. Opale Sculpted Bangle

- Folder: `incoming-images/opale-sculpted-bangle/`
- `[SUBJECT]`: A polished 18k yellow gold bracelet, with no gemstones. A softly faceted bangle that moves gracefully with the wrist. Dimensions: width 8 mm
- `[FOCUS]`: the links or band surface and the clasp

### 19. Perle Tennis Bracelet

- Folder: `incoming-images/perle-tennis-bracelet/`
- `[SUBJECT]`: A polished 18k white gold bracelet, set with round brilliant diamonds, 3.0 ct total. A continuous line of brilliant-cut diamonds on a flexible, hidden-clasp bracelet. Dimensions: width 3 mm
- `[FOCUS]`: the links or band surface and the clasp, with the gemstone as the hero

### 20. Calliope Chain Bracelet

- Folder: `incoming-images/calliope-chain-bracelet/`
- `[SUBJECT]`: A polished 18k yellow gold bracelet, with no gemstones. A fine belcher chain with a lobster clasp and a small engraved tag. Dimensions: link 3 mm
- `[FOCUS]`: the links or band surface and the clasp

### 21. Diane Cuff Bracelet

- Folder: `incoming-images/diane-cuff-bracelet/`
- `[SUBJECT]`: A polished 18k yellow gold bracelet, with no gemstones. An open cuff with a hammered finish, shaped to rest comfortably at the wrist. Dimensions: width 12 mm
- `[FOCUS]`: the links or band surface and the clasp

### 22. Sorel Charm Bracelet

- Folder: `incoming-images/sorel-charm-bracelet/`
- `[SUBJECT]`: A polished 18k yellow gold bracelet, with no gemstones. A trace-chain bracelet with three tiny charms: a star, a key and a heart. Dimensions: charms 7 mm
- `[FOCUS]`: the links or band surface and the clasp

### 23. Linnea Pearl Bracelet

- Folder: `incoming-images/linnea-pearl-bracelet/`
- `[SUBJECT]`: A polished 18k yellow gold bracelet, set with 6 mm freshwater pearls. Round pearls strung on silk with a gold toggle clasp. Dimensions: pearls 6 mm
- `[FOCUS]`: the links or band surface and the clasp, with the gemstone as the hero

### 24. Orion Link Bracelet

- Folder: `incoming-images/orion-link-bracelet/`
- `[SUBJECT]`: A polished 18k yellow gold bracelet, with no gemstones. Oval links of polished gold, each a little different, joined as one. Dimensions: link 9 mm
- `[FOCUS]`: the links or band surface and the clasp

### 25. Aurore Pearl Drop Earrings

- Folder: `incoming-images/aurore-pearl-drop-earrings/`
- `[SUBJECT]`: A polished 18k yellow gold pair of earrings, set with 8 mm freshwater pearls. Hand-selected pearls suspended from polished gold hooks. Dimensions: drop 32 mm
- `[FOCUS]`: a single earring, showing the setting and the fixing, with the gemstone as the hero

### 26. Soleil Stud Earrings

- Folder: `incoming-images/soleil-stud-earrings/`
- `[SUBJECT]`: A polished 18k yellow gold pair of earrings, set with pavé diamonds. Pavé diamonds in a radiating gold setting, small enough to wear all day. Dimensions: diameter 8 mm
- `[FOCUS]`: a single earring, showing the setting and the fixing, with the gemstone as the hero

### 27. Camille Hoop Earrings

- Folder: `incoming-images/camille-hoop-earrings/`
- `[SUBJECT]`: A polished 18k yellow gold pair of earrings, with no gemstones. Lightweight hollow hoops with a high polish and a secure hinged closure. Dimensions: diameter 22 mm
- `[FOCUS]`: a single earring, showing the setting and the fixing

### 28. Rosalind Chandelier Earrings

- Folder: `incoming-images/rosalind-chandelier-earrings/`
- `[SUBJECT]`: A polished 18k white gold pair of earrings, set with diamonds, 2.4 ct total. Tiers of diamonds that sway with every step, finished with a pear-cut drop. Dimensions: drop 48 mm
- `[FOCUS]`: a single earring, showing the setting and the fixing, with the gemstone as the hero

### 29. Mireille Huggie Earrings

- Folder: `incoming-images/mireille-huggie-earrings/`
- `[SUBJECT]`: A polished 18k yellow gold pair of earrings, with no gemstones. Close-fitting huggies with a softly domed profile. Dimensions: diameter 12 mm
- `[FOCUS]`: a single earring, showing the setting and the fixing

### 30. Ondine Threader Earrings

- Folder: `incoming-images/ondine-threader-earrings/`
- `[SUBJECT]`: A polished 18k yellow gold pair of earrings, set with 5 mm freshwater pearls. A fine chain threads through the ear and ends in a single small pearl. Dimensions: chain 70 mm
- `[FOCUS]`: a single earring, showing the setting and the fixing, with the gemstone as the hero

## Consistency tips

- Generate each product's three views in one conversation so the design stays the same piece. Re-state the full `[SUBJECT]` every time.
- If a result adds text, hands, a second piece or wrong stone count, regenerate rather than editing: stone counts and clasps are easy for models to get wrong.
- Check each piece against its description (for example, three diamonds for the trilogy ring, graduated pearls for the rivière).
- Keep the backdrop and light identical between views 1 and 2; only view 3 adds the plinth and linen.

## Licensing and disclosure

- These will be AI-generated images. Check the terms of the tool you use for commercial use, and keep a record of the tool and date.
- Many tools embed an invisible provenance watermark; that is fine and should not be removed.
- The pieces and brand are fictional. Do not prompt with real brand names or ask for copies of real designs.

## Status

All 90 images were generated, reviewed and wired in. To replace one, overwrite `incoming-images/<slug>/<n>.png` and run `npm run images:process -- --force`.
