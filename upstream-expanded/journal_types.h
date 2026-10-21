#pragma once
#include <stdint.h>
struct TPJournalEntry { uint32_t epoch; uint16_t species,a,b; uint8_t kind,flags; char nickname[24]; };
struct TPJournalPending { uint32_t epoch,due; uint16_t from,to; char nickname[24]; };
static_assert(sizeof(TPJournalEntry)==36,"Journal record layout changed");
static_assert(sizeof(TPJournalPending)==36,"Journal pending layout changed");
enum : uint8_t { JR_EGG=1,JR_HATCH,JR_EVOLVE,JR_CAPTURE,JR_PERSONALITY,JR_RECORD,JR_EXPEDITION,JR_LEVEL,JR_COLLECTION,JR_MEDAL,JR_END,JR_MEGA_STONE,JR_MEGA_BEGIN,JR_MEGA_END };
