#pragma once
#include <stdint.h>
// Region IDs are explicit and stable. Unknown IDs must not fall back to Kanto.
enum class TPProgressRegion : uint8_t { Kanto=0, Johto=1 };
struct TPRegionProgressKeys {
 const char *arenaVersion;
 const char *arenaMask;
 const char *arenaDatePrefix;
 const char *leagueVersion;
 const char *leagueRun;
 const char *leagueDone;
 const char *leagueDate;
 const char *hallVersion;
 const char *hallData;
 const char *rewardVersion;
 const char *rewardState;
 const char *rewardDex;
 const char *rewardArmed;
 const char *rewardBorn;
};
// These legacy Kanto names are frozen: no migration and no automatic writes.
inline constexpr TPRegionProgressKeys TP_KANTO_KEYS = {
 "agver", "agmask", "agt", "lgver", "lgkrun", "lgkdone", "lgkdate", "lhver", "lhdata", "rkver", "rkstate", "rkdex", "rkarm", "rkborn"
};
// Reserved for Johto. No playable Johto controller is enabled by this header.
inline constexpr TPRegionProgressKeys TP_JOHTO_KEYS = {
 "jagver", "jagmask", "jagt", "jlgver", "jlgrun", "jlgdone", "jlgdate", "jlhver", "jlhdata", "jrkver", "jrkstate", "jrkdex", "jrkarm", "jrkborn"
};
inline constexpr const TPRegionProgressKeys *tpRegionProgressKeys(uint8_t id) {
 return id==uint8_t(TPProgressRegion::Kanto)?&TP_KANTO_KEYS:
        id==uint8_t(TPProgressRegion::Johto)?&TP_JOHTO_KEYS:nullptr;
}
