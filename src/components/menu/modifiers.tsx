import { Dish } from "@/api/model/dish.ts";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { MenuDish } from "@/components/menu/dish.tsx";
import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";
import { CartModifierGroup, MenuItem, MenuItemType } from "@/api/model/cart_item.ts";
import { useAtom } from "jotai";
import { appState } from "@/store/jotai.ts";
import { nanoid } from "nanoid";
import ScrollContainer from "react-indiana-drag-scroll";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Props {
  dish?: Dish
  onClose?: (payload: CartModifierGroup[]) => void
  isOpen: boolean
  groups: CartModifierGroup[]
  level: number
  editing?: boolean
}

export const MenuDishModifiers = (props: Props) => {
  const [state] = useAtom(appState);
  const [groups, setGroups] = useState(props.groups);
  const [group, setGroup] = useState<CartModifierGroup>();
  const ITEMS_PER_SLIDE = 18;

  const slides = useMemo(() => {
    if( !group ) {
      return 1;
    }

    return Math.ceil(group.modifiers.length / ITEMS_PER_SLIDE);
  }, [group]);

  const selected = useMemo(() => {
    return groups.reduce((prev, item) => prev + item.selectedModifiers.length, 0);
  }, [groups]);

  const required = useMemo(() => {
    return groups.filter(item => item.has_required_modifiers).reduce((prev, item) => prev + item.required_modifiers, 0);
  }, [groups]);

  const optional = useMemo(() => {
    return groups.filter(item => !item.has_required_modifiers).length;
  }, [groups]);

  const isDismissible = useMemo(() => {
    if( !groups || groups.length === 0 ) {
      return true;
    }

    if(!props.editing && selected === 0){
      return true;
    }

    // all required should be selected
    if(required > 0){
      let shouldClose = true;
      for(const grp of groups){
        if(grp.has_required_modifiers && grp.required_modifiers !== grp.selectedModifiers.length){
          shouldClose = false;
        }
      }

      return shouldClose;
    }

    return required === selected;
  }, [groups, selected, required, group, props.editing]);

  useEffect(() => {
    if( props.dish && !group && groups.length > 0 ) {
      setGroup(groups[0]);
    }

    if( group && group.modifiers.length === group.required_modifiers && props.editing !== true ) {
      group.modifiers.forEach(dish => {
        onModifierClick(buildModifiersObj(dish.dish));
      });
    }
  }, [props.dish, group, state.seat, props.level, props.editing]);

  const onModifierClick = (d: MenuItem, selectedGroups?: CartModifierGroup[]) => {
    const newGroups = [...groups];
    newGroups.map(grp => {
      if(grp.out.id === group.out.id){
        if(
          (grp.has_required_modifiers && grp.selectedModifiers.length !== grp.required_modifiers) ||
          (!grp.has_required_modifiers)
        ) {
          const newGroup = {...group};
          // delete newGroup.selectedModifiers;
          grp.selectedModifiers.push(buildModifiersObj(d.dish, selectedGroups));
        }
      }
    });

    setGroups(newGroups);
  }

  const buildModifiersObj = (dish: Dish, groups?: CartModifierGroup[]): MenuItem => {
    return {
      dish: dish,
      seat: state.seat,
      id: nanoid(),
      quantity: 1,
      level: props.level,
      selectedGroups: groups,
      isModifier: true,
      newOrOld: MenuItemType.new
    }
  }

  const requireClass = (grp: CartModifierGroup) => {
    if( grp.has_required_modifiers && grp.selectedModifiers.length < grp.required_modifiers ) {
      return 'bg-danger-200';
    } else if( grp.has_required_modifiers && grp.selectedModifiers.length === grp.required_modifiers) {
      return ''; //'bg-success-200';
    }

    return 'bg-white';
  }

  useEffect(() => {
    if( group ) {
      if(
        (group.has_required_modifiers && group.selectedModifiers.length === group.required_modifiers)
        || !group.has_required_modifiers
      ) {
        // move to next group if exists
        const nextGroup = groups.find(item => item.has_required_modifiers && item.selectedModifiers.length !== item.required_modifiers);
        if(nextGroup){
          setGroup(nextGroup);
        }
      }
    }
  }, [groups, group]);

  // close modifiers box automatically when all required groups are selected and optional modifiers are 0
  useEffect(() => {
    if(selected === required && optional === 0 && props.editing !== true){
      props.onClose(selected > 0 ? groups : []);
    }
  }, [selected, required, groups, optional, props]);

  const removeItem = (group: CartModifierGroup, itemIndex: number) => {
    const newGroups = [...groups];
    newGroups.map(grp => {
      if(grp.out.id === group.out.id){
        grp.selectedModifiers.splice(itemIndex, 1);
      }
    });

    setGroups(newGroups);
  }

  return (
    <Modal
      open={props.isOpen}
      title={`Modify ${props.dish.name}`}
      shouldCloseOnOverlayClick={isDismissible}
      hideCloseButton={!isDismissible}
      onClose={() => {
        // pass groups when required selected modifiers are greater than 0 or optional groups are greater than 0
        props.onClose(selected > 0 || optional > 0 ? groups : []);
      }}
      size="full"
    >
      {props.dish && (
        <div className="grid grid-cols-7 gap-3">
          <div className="col-span-1 flex flex-col rounded-3xl bg-neutral-100">
            <ScrollContainer className="modifiers-swiper">
              {groups.map((item, index) => (
                <span
                  className={
                    cn(
                      'flex flex-col items-center justify-center p-1 cursor-pointer min-h-[56px]',
                      index === 0 && 'rounded-t-3xl',
                      index + 1 === groups.length && 'rounded-b-3xl',
                      group?.out?.id === item.out.id ? 'bg-gradient' : requireClass(item)
                    )
                  }
                  style={{
                    '--padding': '0'
                  } as any}
                  key={item.out.id}
                  onClick={() => setGroup(item)}
                >
                  <span>{item.out.name}</span>
                  <>{item.has_required_modifiers && (
                    <span className="text-sm">{item.selectedModifiers.length} / {item.required_modifiers}</span>
                  )}</>
                </span>
              ))}
            </ScrollContainer>
          </div>
          <div className="col-span-4">
            {group && (
              <Swiper
                slidesPerView={1}
                className="modifiers-swiper"
                direction="vertical"
              >
                {_.range(0, slides).map(rowId => (
                  <SwiperSlide
                    key={rowId}
                    className={cn(
                      'grid grid-cols-3 grid-rows-7'
                    )}
                  >
                    {group.modifiers.slice(rowId * ITEMS_PER_SLIDE, ((rowId * ITEMS_PER_SLIDE) + ITEMS_PER_SLIDE)).map((modifier, mIndex) => (
                      <MenuDish
                        onClick={onModifierClick}
                        item={modifier.dish}
                        key={mIndex}
                        level={props.level + 1}
                        isModifier
                      />
                    ))}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <div className="col-span-2 bg-white p-3 rounded-3xl">
            <ScrollContainer className="modifiers-swiper">
              {groups.map((g, index) => (
                <div key={index}>
                  <span className="font-bold">{g.out.name}</span>
                  {g.selectedModifiers.map((m, mIndex) => (
                    <div key={mIndex} className="flex justify-between">
                      <span>
                        <Button variant="danger" flat iconButton onClick={() => removeItem(g, mIndex)}>
                          <FontAwesomeIcon icon={faTimes} />
                        </Button>{' '}
                        {m.dish.name}
                      </span>
                      <span>
                         {m.dish.price}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </ScrollContainer>
          </div>
        </div>
      )}
    </Modal>
  )
}
