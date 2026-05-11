import {
  PawPrint,
  CircleUserRound,
  BookOpen,
  ClipboardPen,
  Scale,
  Activity,
  ShoppingBag,
  List,
  House,
  ChevronLeft,
  Check,
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Upload,
  Calendar,
  Scissors,
  Footprints,
  ShowerHead,
  Ruler,
  Banknote,
} from 'lucide-react'

function wrap(Icon) {
  return function Wrapped({ size = 20, color = 'currentColor' }) {
    return <Icon size={size} color={color} strokeWidth={2} />
  }
}

export const PawIcon        = wrap(PawPrint)
export const ProfileIcon    = wrap(CircleUserRound)
export const BreedIcon      = wrap(BookOpen)
export const ClipboardIcon  = wrap(ClipboardPen)
export const ScaleIcon      = wrap(Scale)
export const PoopIcon       = wrap(Activity)
export const FoodBowlIcon   = wrap(ShoppingBag)
export const ListIcon       = wrap(List)
export const HomeIcon       = wrap(House)
export const BackIcon       = wrap(ChevronLeft)
export const CheckIcon      = wrap(Check)
export const TrendUpIcon    = wrap(TrendingUp)
export const PlusIcon       = wrap(Plus)
export const TrashIcon      = wrap(Trash2)
export const DownloadIcon   = wrap(Download)
export const UploadIcon     = wrap(Upload)
export const CalendarIcon   = wrap(Calendar)
export const GroomingIcon   = wrap(Scissors)
export const WalkIcon       = wrap(Footprints)
export const BathIcon       = wrap(ShowerHead)
export const RulerIcon      = wrap(Ruler)
export const MoneyIcon       = wrap(Banknote)
